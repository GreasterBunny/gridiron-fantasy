'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DraftBoard } from '@/components/draft/DraftBoard'
import { PlayerPool } from '@/components/draft/PlayerPool'
import { PickClock } from '@/components/draft/PickClock'
import { getDraftProgress, getTeamOnTheClock, isOnTheClock } from '@/lib/draft-engine'
import type { DraftSession, DraftPick } from '@/lib/draft-engine'
import type { Tables } from '@/lib/supabase/database.types'
import { cn } from '@/lib/utils'

type Team = { id: string; name: string; user_id: string; logo_url: string | null }
type Player = Tables<'nfl_players'>

interface DraftRoomProps {
  leagueId: string
  initialSession: DraftSession
  initialPicks: DraftPick[]
  initialTeams: Team[]
  initialPlayers: Player[]
  currentUserId: string
  myTeamId: string | null
}

export function DraftRoom({
  leagueId,
  initialSession,
  initialPicks,
  initialTeams,
  initialPlayers,
  currentUserId,
  myTeamId,
}: DraftRoomProps) {
  const supabase = createClient()
  const [session, setSession] = useState<DraftSession>(initialSession)
  const [picks, setPicks] = useState<DraftPick[]>(initialPicks)
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [isDrafting, setIsDrafting] = useState(false)
  const [lastPick, setLastPick] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const myTurn = myTeamId ? isOnTheClock(session, myTeamId) : false
  const teamOnClock = getTeamOnTheClock(session)
  const teamOnClockName = initialTeams.find(t => t.id === teamOnClock)?.name ?? '...'
  const progress = getDraftProgress(session, picks)
  const numTeams = (session.pick_order as string[]).length

  // ─── Realtime ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`draft:${leagueId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'draft_picks', filter: `league_id=eq.${leagueId}` },
        async () => {
          const [sessionRes, picksRes] = await Promise.all([
            supabase.from('draft_sessions').select('*').eq('league_id', leagueId).single(),
            supabase.from('draft_picks').select(`*, nfl_players(*), fantasy_teams(id, name, user_id)`)
              .eq('league_id', leagueId).order('overall_pick'),
          ])
          if (sessionRes.data) setSession(sessionRes.data as DraftSession)
          if (picksRes.data) {
            setPicks(picksRes.data as unknown as DraftPick[])
            const draftedIds = new Set(picksRes.data.map(p => p.player_id).filter(Boolean))
            setPlayers(prev => prev.filter(p => !draftedIds.has(p.id)))
            const lastPicked = picksRes.data.findLast(p => p.player_id)
            if (lastPicked) {
              const pName = (lastPicked.nfl_players as { full_name: string } | null)?.full_name
              if (pName) setLastPick(pName)
              setTimeout(() => setLastPick(null), 3500)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'draft_sessions', filter: `league_id=eq.${leagueId}` },
        async (payload) => { setSession(payload.new as DraftSession) }
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [leagueId])

  const handleDraftPlayer = useCallback(async (playerId: string) => {
    if (!myTeamId || !myTurn || isDrafting) return
    setIsDrafting(true)
    try {
      const res = await fetch(`/api/draft/${leagueId}/pick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, fantasyTeamId: myTeamId }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('Pick failed:', err.error)
      }
    } finally {
      setIsDrafting(false)
    }
  }, [myTeamId, myTurn, isDrafting, leagueId])

  const handleClockExpire = useCallback(async () => {
    if (!myTurn || !myTeamId) return
    const best = players[0]
    if (best) await handleDraftPlayer(best.id)
  }, [myTurn, myTeamId, players, handleDraftPlayer])

  if (session.status === 'complete') {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen gap-5"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,160,32,0.10) 0%, transparent 70%), #08090C' }}
      >
        <div className="text-5xl">🏆</div>
        <h1
          className="text-3xl font-extrabold tracking-[-0.03em] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Draft Complete!
        </h1>
        <p className="text-[#7C8099]">Good luck this season.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#08090C]">
      {/* Top bar */}
      <header className="bg-[#0A0B0F] border-b border-white/[0.07] px-4 py-2.5 shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
          <span
            className="font-extrabold text-white text-base tracking-tight shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gridiron
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded px-2 py-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-[10px] text-[#5A6080] mb-1">
              <span>Round {session.current_round} · Pick {session.current_pick} of {numTeams}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${progress}%`, background: '#E8A020' }}
              />
            </div>
          </div>
          <div className={cn('text-sm font-bold ml-auto shrink-0', myTurn ? 'text-[#E8A020]' : 'text-[#7C8099]')}>
            {myTurn ? (
              <span className="animate-pulse">⚡ YOUR TURN</span>
            ) : (
              <span>On clock: <span className="text-[#F1F3F9]">{teamOnClockName}</span></span>
            )}
          </div>
        </div>
      </header>

      {/* Pick clock */}
      <div className="border-b border-white/[0.07] px-4 py-2 shrink-0" style={{ background: '#0D0E12' }}>
        <div className="max-w-screen-2xl mx-auto">
          <PickClock
            totalSeconds={session.time_per_pick_seconds}
            pickStartedAt={session.pick_started_at}
            isOnTheClock={myTurn}
            onExpire={handleClockExpire}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden max-w-screen-2xl mx-auto w-full p-2.5 gap-2.5">
        {/* Draft board */}
        <div
          className="flex-1 rounded-xl border border-white/[0.08] overflow-hidden flex flex-col"
          style={{ background: '#0F1117', boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          <div className="px-4 py-2.5 border-b border-white/[0.07] shrink-0">
            <h2 className="font-bold text-sm text-[#F1F3F9]">Draft Board</h2>
          </div>
          <DraftBoard
            session={session}
            picks={picks}
            teams={initialTeams}
            currentUserId={currentUserId}
          />
        </div>

        {/* Player pool */}
        <div
          className="w-80 rounded-xl border border-white/[0.08] overflow-hidden flex flex-col shrink-0"
          style={{ background: '#0F1117', boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          <div className="px-4 py-2.5 border-b border-white/[0.07] shrink-0 flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#F1F3F9]">Available Players</h2>
            <span className="text-xs text-[#5A6080]">{players.length} left</span>
          </div>
          <PlayerPool
            leagueId={leagueId}
            players={players}
            isLoading={false}
            isOnTheClock={myTurn}
            onDraftPlayer={handleDraftPlayer}
            isDrafting={isDrafting}
          />
        </div>
      </div>

      {/* Last pick toast */}
      {lastPick && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-bold z-50 text-[#F1F3F9]"
          style={{
            background: '#161922',
            border: '1px solid rgba(232,160,32,0.30)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,160,32,0.20)',
          }}
        >
          <span style={{ color: '#E8A020' }}>✓</span> {lastPick} drafted
        </div>
      )}
    </div>
  )
}
