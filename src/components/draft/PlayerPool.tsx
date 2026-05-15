'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { POSITION_COLORS } from '@/lib/constants'
import type { PositionGroup } from '@/types'
import { cn } from '@/lib/utils'

type Player = {
  id: string
  full_name: string
  position: string
  position_group: string
  nfl_team_abbr: string
  injury_status: string
  avg_fantasy_pts: number | null
  depth_chart_position: number | null
}

const POSITION_TABS: Array<{ key: string; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'QB',  label: 'QB' },
  { key: 'RB',  label: 'RB' },
  { key: 'WR',  label: 'WR' },
  { key: 'TE',  label: 'TE' },
  { key: 'OL',  label: 'OL' },
  { key: 'DL',  label: 'DL' },
  { key: 'LB',  label: 'LB' },
  { key: 'DB',  label: 'DB' },
]

const INJURY_COLORS: Record<string, string> = {
  active:       '',
  questionable: 'text-amber-400',
  doubtful:     'text-orange-400',
  out:          'text-red-400',
  ir:           'text-red-500',
}

interface PlayerPoolProps {
  leagueId: string
  players: Player[]
  isLoading: boolean
  isOnTheClock: boolean
  onDraftPlayer: (playerId: string) => void
  isDrafting: boolean
}

export function PlayerPool({
  leagueId,
  players,
  isLoading,
  isOnTheClock,
  onDraftPlayer,
  isDrafting,
}: PlayerPoolProps) {
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('ALL')

  const filtered = players.filter(p => {
    const matchPos = positionFilter === 'ALL' || p.position_group === positionFilter
    const matchSearch = search.length < 2 || p.full_name.toLowerCase().includes(search.toLowerCase())
    return matchPos && matchSearch
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search + position tabs */}
      <div className="p-3 border-b border-white/[0.07] space-y-2 shrink-0">
        <input
          type="text"
          placeholder="Search players…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#161922] border border-white/[0.10] rounded-lg px-3 py-1.5 text-sm text-[#F1F3F9]
            placeholder:text-[#5A6080]
            focus:outline-none focus:ring-2 focus:ring-[#E8A020] focus:border-transparent
            transition-[box-shadow,border-color] duration-150"
        />
        <div className="flex gap-1 flex-wrap">
          {POSITION_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setPositionFilter(tab.key)}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-[background-color,border-color,color] duration-150',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E8A020]',
                positionFilter === tab.key
                  ? 'bg-[#E8A020] text-[#08090C] border-[#E8A020]'
                  : 'bg-white/[0.05] text-[#7C8099] border-white/[0.10] hover:bg-white/[0.10] hover:text-[#F1F3F9]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-1.5 border-b border-white/[0.07] bg-white/[0.02] text-[10px] text-[#5A6080] font-semibold shrink-0">
        <span>Player</span>
        <span className="text-right w-10">Team</span>
        <span className="text-right w-12">Avg Pts</span>
        <span className="w-14" />
      </div>

      {/* Player list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#5A6080] text-sm">
            No available players found.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filtered.map(player => {
              const posColor = POSITION_COLORS[player.position_group as PositionGroup] ?? ''
              const injuryColor = INJURY_COLORS[player.injury_status] ?? ''
              const unavailable = player.injury_status === 'out' || player.injury_status === 'ir'
              const canDraft = isOnTheClock && !unavailable && !isDrafting

              return (
                <div
                  key={player.id}
                  className={cn(
                    'grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-3 py-2',
                    'hover:bg-white/[0.03] transition-[background-color] duration-100',
                    unavailable && 'opacity-40'
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[9px] px-1 py-0 rounded border font-bold shrink-0 leading-tight', posColor)}>
                        {player.position}
                      </span>
                      <span className="text-sm font-medium text-[#F1F3F9] truncate">{player.full_name}</span>
                      {player.injury_status !== 'active' && (
                        <span className={cn('text-[9px] font-bold uppercase shrink-0', injuryColor)}>
                          {player.injury_status.slice(0, 3).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7C8099] font-mono w-10 text-right">
                    {player.nfl_team_abbr}
                  </span>
                  <span className="text-xs font-bold text-right w-12 text-[#F1F3F9] tabular-nums">
                    {player.avg_fantasy_pts?.toFixed(1) ?? '—'}
                  </span>
                  <button
                    onClick={() => canDraft && onDraftPlayer(player.id)}
                    disabled={!canDraft}
                    className={cn(
                      'w-14 text-[10px] font-bold py-1.5 rounded-md border transition-[background-color,border-color,transform] duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020]',
                      canDraft
                        ? 'bg-[#E8A020] text-[#08090C] border-[#E8A020] hover:bg-[#F0B030] active:scale-95 cursor-pointer'
                        : 'bg-white/[0.04] text-[#5A6080] border-white/[0.08] cursor-not-allowed'
                    )}
                  >
                    {isDrafting ? '…' : 'Draft'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
