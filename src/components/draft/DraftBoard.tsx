'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
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

  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]))
  const pickMap = Object.fromEntries(picks.map(p => [p.overall_pick, p]))
  const rounds = Array.from({ length: totalRounds }, (_, r) => r + 1)

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {/* Team header row */}
        <div
          className="grid gap-1 mb-1.5"
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
                  'text-center text-[9px] font-bold truncate px-1 py-1 rounded',
                  isYou
                    ? 'bg-[#E8A020]/15 text-[#E8A020] border border-[#E8A020]/30'
                    : 'bg-white/[0.05] text-[#7C8099] border border-white/[0.07]'
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
                <div className="flex items-center justify-center text-[9px] text-[#5A6080] font-bold">
                  R{round}
                </div>
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
                        'rounded border text-[9px] p-1 min-h-[40px] flex flex-col justify-center transition-[background-color,border-color] duration-150',
                        isCurrent && isYou && 'border-[#E8A020] bg-[#E8A020]/10 ring-1 ring-[#E8A020]/50',
                        isCurrent && !isYou && 'border-amber-500/40 bg-amber-500/[0.06]',
                        !isCurrent && pick?.player_id && !isYou && 'bg-white/[0.04] border-white/[0.08]',
                        !isCurrent && pick?.player_id && isYou && 'bg-[#E8A020]/[0.07] border-[#E8A020]/25',
                        !isCurrent && !pick?.player_id && 'border-dashed border-white/[0.07] bg-transparent',
                      )}
                    >
                      {player ? (
                        <>
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <span
                              className={cn(
                                'text-[7px] px-0.5 py-0 rounded border leading-none font-bold',
                                POSITION_COLORS[player.position_group as PositionGroup]
                              )}
                            >
                              {player.position}
                            </span>
                          </div>
                          <span className="font-semibold leading-tight truncate text-[#F1F3F9]">
                            {player.full_name}
                          </span>
                        </>
                      ) : isCurrent ? (
                        <span className="text-[#E8A020] font-bold animate-pulse text-center text-[9px]">
                          On Clock
                        </span>
                      ) : (
                        <span className="text-[#3A4060] text-center tabular-nums">{overall}</span>
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
