'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DraftBoard } from '@/components/draft/DraftBoard'
import { PlayerPool } from '@/components/draft/PlayerPool'
import { PickClock } from '@/components/draft/PickClock'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

  // ─── Supabase Realtime ───────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`draft:${leagueId}`)
      // New pick made → refresh picks + session
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'draft_picks', filter: `league_id=eq.${leagueId}` },
        async () => {
          const [sessionRes, picksRes] = await Promise.all([
            supabase.from('draft_sessions').select('*').eq('league_id', leagueId).single(),
            supabase.from('draft_picks').select(`
              *, nfl_players(*), fantasy_teams(id, name, user_id)
            `).eq('league_id', leagueId).order('overall_pick'),
          ])
          if (sessionRes.data) setSession(sessionRes.data as DraftSession)
          if (picksRes.data) {
            setPicks(picksRes.data as unknown as DraftPick[])
            // Remove newly drafted player from pool
            const draftedIds = new Set(picksRes.data.map(p => p.player_id).filter(Boolean))
            setPlayers(prev => prev.filter(p => !draftedIds.has(p.id)))

            // Show last pick toast
            const lastPicked = picksRes.data.findLast(p => p.player_id)
            if (lastPicked) {
              const pName = (lastPicked.nfl_players as { full_name: string } | null)?.full_name
              if (pName) setLastPick(pName)
              setTimeout(() => setLastPick(null), 3000)
            }
          }
        }
      )
      // Session status changes (complete, etc.)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'draft_sessions', filter: `league_id=eq.${leagueId}` },
        async (payload) => {
          setSession(payload.new as DraftSession)
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [leagueId])

  // ─── Make a pick ─────────────────────────────────────────────────────────────
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

  // ─── Clock expire → auto-pick best available ──────────────────────────────
  const handleClockExpire = useCallback(async () => {
    if (!myTurn || !myTeamId) return
    const best = players[0]
    if (best) await handleDraftPlayer(best.id)
  }, [myTurn, myTeamId, players, handleDraftPlayer])

  // ─── Render ───────────────────────────────────────────────────────────────
  if (session.status === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-4xl">🏆</div>
        <h1 className="text-2xl font-black">Draft Complete!</h1>
        <p className="text-muted-foreground">Good luck this season.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top bar */}
      <header className="bg-slate-950 text-white px-4 py-2 shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
          <span className="font-black text-lg">Gridiron Draft</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            LIVE
          </Badge>
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Round {session.current_round} · Pick {session.current_pick} of {numTeams}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-slate-700 [&>div]:bg-yellow-400" />
          </div>
          <div className={cn('text-sm font-bold', myTurn ? 'text-yellow-400 animate-pulse' : 'text-slate-300')}>
            {myTurn ? '⚡ YOUR TURN' : `On clock: ${teamOnClockName}`}
          </div>
        </div>
      </header>

      {/* Pick clock */}
      <div className="bg-white border-b px-4 py-2 shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <PickClock
            totalSeconds={session.time_per_pick_seconds}
            pickStartedAt={session.pick_started_at}
            isOnTheClock={myTurn}
            onExpire={handleClockExpire}
          />
        </div>
      </div>

      {/* Main layout: board + player pool */}
      <div className="flex-1 flex overflow-hidden max-w-screen-2xl mx-auto w-full p-2 gap-2">
        {/* Draft board (left, 2/3 width) */}
        <div className="flex-1 bg-white rounded-lg border overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b shrink-0">
            <h2 className="font-bold text-sm">Draft Board</h2>
          </div>
          <DraftBoard
            session={session}
            picks={picks}
            teams={initialTeams}
            currentUserId={currentUserId}
          />
        </div>

        {/* Player pool (right, 1/3 width) */}
        <div className="w-80 bg-white rounded-lg border overflow-hidden flex flex-col shrink-0">
          <div className="px-3 py-2 border-b shrink-0 flex items-center justify-between">
            <h2 className="font-bold text-sm">Available Players</h2>
            <span className="text-xs text-muted-foreground">{players.length} left</span>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-in slide-in-from-bottom-4 z-50">
          ✓ {lastPick} drafted
        </div>
      )}
    </div>
  )
}
