'use client'

import { useState, useCallback, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
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
  questionable: 'text-yellow-600',
  doubtful:     'text-orange-600',
  out:          'text-red-600',
  ir:           'text-red-800',
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
      <div className="p-3 border-b space-y-2 shrink-0">
        <Input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
        <div className="flex gap-1 flex-wrap">
          {POSITION_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setPositionFilter(tab.key)}
              className={cn(
                'px-2 py-0.5 rounded text-xs font-bold border transition-colors',
                positionFilter === tab.key
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-1.5 bg-slate-50 border-b text-xs text-muted-foreground font-semibold shrink-0">
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
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No available players found.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(player => {
              const posColor = POSITION_COLORS[player.position_group as PositionGroup] ?? ''
              const injuryColor = INJURY_COLORS[player.injury_status] ?? ''
              const unavailable = player.injury_status === 'out' || player.injury_status === 'ir'

              return (
                <div
                  key={player.id}
                  className={cn(
                    'grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-3 py-2 hover:bg-slate-50 transition-colors',
                    unavailable && 'opacity-50'
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn('text-[10px] px-1 py-0 border shrink-0', posColor)}>
                        {player.position}
                      </Badge>
                      <span className="text-sm font-medium truncate">{player.full_name}</span>
                      {player.injury_status !== 'active' && (
                        <span className={cn('text-[10px] font-bold uppercase shrink-0', injuryColor)}>
                          {player.injury_status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono w-10 text-right">
                    {player.nfl_team_abbr}
                  </span>
                  <span className="text-xs font-bold text-right w-12">
                    {player.avg_fantasy_pts?.toFixed(1) ?? '—'}
                  </span>
                  <button
                    onClick={() => onDraftPlayer(player.id)}
                    disabled={!isOnTheClock || isDrafting || unavailable}
                    className={cn(
                      'w-14 text-xs font-bold py-1 rounded border transition-colors',
                      isOnTheClock && !unavailable
                        ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-700 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    )}
                  >
                    {isDrafting ? '...' : 'Draft'}
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
