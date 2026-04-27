'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { POSITION_COLORS } from '@/lib/constants'
import type { DraftPick, DraftSession } from '@/lib/draft-engine'
import type { PositionGroup } from '@/types'
import { cn } from '@/lib/utils'

interface DraftBoardProps {
  session: DraftSession
  picks: DraftPick[]
  teams: Array<{ id: string; name: string; user_id: string }>
  currentUserId?: string
}

export function DraftBoard({ session, picks, teams, currentUserId }: DraftBoardProps) {
  const numTeams = teams.length
  const totalRounds = Math.ceil(picks.length / Math.max(numTeams, 1))
  const pickOrder = session.pick_order as string[]

  // Map teamId → team info
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]))

  // Map overall_pick → pick data
  const pickMap = Object.fromEntries(picks.map(p => [p.overall_pick, p]))

  // Build grid: rows = rounds, cols = teams in snake order
  const rounds = Array.from({ length: totalRounds }, (_, r) => r + 1)

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {/* Team header row */}
        <div
          className="grid gap-1 mb-1"
          style={{ gridTemplateColumns: `2rem repeat(${numTeams}, minmax(0,1fr))` }}
        >
          <div />
          {pickOrder.map(teamId => {
            const team = teamMap[teamId]
            const isYou = team?.user_id === currentUserId
            return (
              <div
                key={teamId}
                className={cn(
                  'text-center text-[10px] font-bold truncate px-1 py-0.5 rounded',
                  isYou ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {team?.name ?? '—'}
              </div>
            )
          })}
        </div>

        {/* Pick grid */}
        <div className="space-y-1">
          {rounds.map(round => {
            const isEven = round % 2 === 0
            const orderedTeams = isEven ? [...pickOrder].reverse() : [...pickOrder]
            const currentOverall = (session.current_round - 1) * numTeams + session.current_pick

            return (
              <div
                key={round}
                className="grid gap-1"
                style={{ gridTemplateColumns: `2rem repeat(${numTeams}, minmax(0,1fr))` }}
              >
                {/* Round label */}
                <div className="flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                  R{round}
                </div>

                {/* Picks for this round */}
                {orderedTeams.map((teamId, idx) => {
                  const overall = (round - 1) * numTeams + idx + 1
                  const pick = pickMap[overall]
                  const isCurrent = overall === currentOverall && session.status === 'in_progress'
                  const team = teamMap[teamId]
                  const isYou = team?.user_id === currentUserId
                  const player = pick?.nfl_players as { full_name: string; position: string; position_group: string } | null

                  return (
                    <div
                      key={teamId}
                      className={cn(
                        'rounded border text-[10px] p-1 min-h-[40px] flex flex-col justify-center transition-all',
                        isCurrent && 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400',
                        !isCurrent && pick?.player_id && 'bg-slate-50 border-slate-200',
                        !isCurrent && !pick?.player_id && 'border-dashed border-slate-200',
                        isYou && pick?.player_id && 'bg-blue-50 border-blue-200',
                        isCurrent && isYou && 'bg-yellow-100 border-yellow-500',
                      )}
                    >
                      {player ? (
                        <>
                          <div className="flex items-center gap-0.5">
                            <Badge
                              className={cn(
                                'text-[8px] px-0.5 py-0 border leading-none',
                                POSITION_COLORS[player.position_group as PositionGroup]
                              )}
                            >
                              {player.position}
                            </Badge>
                          </div>
                          <span className="font-semibold leading-tight truncate mt-0.5">
                            {player.full_name}
                          </span>
                        </>
                      ) : isCurrent ? (
                        <span className="text-yellow-700 font-bold animate-pulse text-center">
                          On Clock
                        </span>
                      ) : (
                        <span className="text-slate-300 text-center">{overall}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}
