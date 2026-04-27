import { ROSTER_SLOTS, TOTAL_ROSTER_SIZE } from '@/lib/constants'
import type { Tables } from '@/lib/supabase/database.types'

export type DraftSession = Tables<'draft_sessions'>
export type DraftPick = Tables<'draft_picks'> & {
  nfl_players?: Tables<'nfl_players'> | null
  fantasy_teams?: { id: string; name: string; user_id: string } | null
}

// ─── Snake Order Generation ───────────────────────────────────────────────────

/**
 * Generates the full snake draft pick order.
 * Round 1: teams in order [A,B,C,D]
 * Round 2: reversed      [D,C,B,A]
 * Round 3: normal        [A,B,C,D] ... etc.
 */
export function generateSnakePicks(
  teamIds: string[],
  totalRounds: number = TOTAL_ROSTER_SIZE
): Array<{ round: number; pick_number: number; overall_pick: number; fantasy_team_id: string }> {
  const picks: ReturnType<typeof generateSnakePicks> = []
  const numTeams = teamIds.length

  for (let round = 1; round <= totalRounds; round++) {
    const isEvenRound = round % 2 === 0
    const orderedTeams = isEvenRound ? [...teamIds].reverse() : [...teamIds]

    orderedTeams.forEach((teamId, idx) => {
      picks.push({
        round,
        pick_number: idx + 1,
        overall_pick: (round - 1) * numTeams + idx + 1,
        fantasy_team_id: teamId,
      })
    })
  }

  return picks
}

// ─── Current State Helpers ────────────────────────────────────────────────────

/** Returns the fantasy_team_id whose turn it is right now. */
export function getTeamOnTheClock(session: DraftSession): string | null {
  if (session.status !== 'in_progress') return null
  const order = session.pick_order as string[]
  const numTeams = order.length
  if (!numTeams) return null

  const isEvenRound = session.current_round % 2 === 0
  const ordered = isEvenRound ? [...order].reverse() : [...order]
  return ordered[(session.current_pick - 1) % numTeams] ?? null
}

/** True if this team ID is currently on the clock. */
export function isOnTheClock(session: DraftSession, teamId: string): boolean {
  return getTeamOnTheClock(session) === teamId
}

/** Returns { round, pick } for the next pick after current. */
export function getNextPickPosition(
  session: DraftSession
): { round: number; pick: number; overall: number } {
  const numTeams = (session.pick_order as string[]).length
  const nextOverall = session.current_pick + 1 + (session.current_round - 1) * numTeams
  // Actually recalculate properly:
  const currentOverall = (session.current_round - 1) * numTeams + session.current_pick
  const nextOverallPick = currentOverall + 1
  const nextRound = Math.ceil(nextOverallPick / numTeams)
  const nextPick = nextOverallPick - (nextRound - 1) * numTeams
  return { round: nextRound, pick: nextPick, overall: nextOverallPick }
}

/** Overall pick number for current position. */
export function getCurrentOverallPick(session: DraftSession): number {
  const numTeams = (session.pick_order as string[]).length
  return (session.current_round - 1) * numTeams + session.current_pick
}

/** Total picks in the draft. */
export function getTotalPicks(numTeams: number): number {
  return numTeams * TOTAL_ROSTER_SIZE
}

/** Percentage of draft completed (0–100). */
export function getDraftProgress(session: DraftSession, picks: DraftPick[]): number {
  const numTeams = (session.pick_order as string[]).length
  const total = getTotalPicks(numTeams)
  const completed = picks.filter(p => p.player_id).length
  return Math.round((completed / total) * 100)
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type PickValidationResult =
  | { valid: true }
  | { valid: false; reason: string }

export function validatePick(
  session: DraftSession,
  teamId: string,
  playerId: string,
  draftedPlayerIds: Set<string>
): PickValidationResult {
  if (session.status !== 'in_progress') {
    return { valid: false, reason: 'Draft is not in progress.' }
  }
  if (!isOnTheClock(session, teamId)) {
    return { valid: false, reason: 'It is not your turn to pick.' }
  }
  if (draftedPlayerIds.has(playerId)) {
    return { valid: false, reason: 'That player has already been drafted.' }
  }
  return { valid: true }
}

// ─── Roster Need Analysis ─────────────────────────────────────────────────────

/**
 * Returns which roster slots still need to be filled for a team.
 * Used to power the "NEED" indicators in the draft UI.
 */
export function getRosterNeeds(
  draftedByTeam: Array<{ position_group: string }>,
  picksRemaining: number
): Array<{ slot: string; label: string; needed: number; filled: number }> {
  const filled: Record<string, number> = {}

  for (const p of draftedByTeam) {
    // Simplified: map position_group directly to slot
    const slot = p.position_group
    filled[slot] = (filled[slot] ?? 0) + 1
  }

  return ROSTER_SLOTS
    .filter(s => s.slot !== 'BN' && s.slot !== 'FLEX' && s.slot !== 'SFLEX')
    .map(s => ({
      slot: s.slot,
      label: s.label,
      needed: s.count,
      filled: filled[s.slot] ?? 0,
    }))
}

// ─── Time Helpers ─────────────────────────────────────────────────────────────

/** Seconds remaining on the pick clock. Returns 0 if expired. */
export function getSecondsRemaining(session: DraftSession): number {
  if (!session.pick_started_at) return session.time_per_pick_seconds
  const elapsed = Math.floor(
    (Date.now() - new Date(session.pick_started_at).getTime()) / 1000
  )
  return Math.max(0, session.time_per_pick_seconds - elapsed)
}

/** Returns a CSS colour class based on time remaining. */
export function getClockColour(secondsRemaining: number, total: number): string {
  const pct = secondsRemaining / total
  if (pct > 0.5) return 'text-green-600'
  if (pct > 0.25) return 'text-yellow-500'
  return 'text-red-600'
}
