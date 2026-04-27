import type { WeeklyStats, ScoringConfig, PositionGroup, NFLPosition, Player } from '@/types'

// ─── Position Group Mapping ───────────────────────────────────────────────────

export function getPositionGroup(position: NFLPosition): PositionGroup {
  const map: Record<NFLPosition, PositionGroup> = {
    QB: 'QB',
    RB: 'RB',
    WR: 'WR',
    TE: 'TE',
    LT: 'OL', LG: 'OL', C: 'OL', RG: 'OL', RT: 'OL',
    DE: 'DL', DT: 'DL',
    OLB: 'LB', MLB: 'LB', ILB: 'LB',
    CB: 'DB', S: 'DB', FS: 'DB', SS: 'DB',
  }
  return map[position] ?? 'QB'
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

/**
 * Pure function — no side effects. Accepts a player's weekly stats and the
 * league's scoring config and returns their fantasy point total.
 *
 * Floor rule: no player scores below 0 regardless of negative events.
 * For OL specifically, negative events can only reduce (not eliminate) base pts.
 */
export function calculatePlayerScore(
  stats: WeeklyStats,
  player: Pick<Player, 'position' | 'position_group'>,
  config: ScoringConfig
): number {
  const group = player.position_group

  switch (group) {
    case 'QB':
    case 'RB':
    case 'WR':
    case 'TE':
      return Math.max(0, calculateOffensiveScore(stats, config))
    case 'OL':
      return calculateOLScore(stats, config)
    case 'DL':
      return Math.max(0, calculateIDPScore(stats, config, 'DL'))
    case 'LB':
      return Math.max(0, calculateIDPScore(stats, config, 'LB'))
    case 'DB':
      return Math.max(0, calculateIDPScore(stats, config, 'DB'))
    default:
      return 0
  }
}

// ─── Offensive Scoring ────────────────────────────────────────────────────────

function calculateOffensiveScore(stats: WeeklyStats, config: ScoringConfig): number {
  let pts = 0

  // Passing
  pts += (stats.pass_yards ?? 0) * config.pass_yard_pts
  pts += (stats.pass_tds ?? 0) * config.pass_td_pts
  pts += (stats.interceptions_thrown ?? 0) * config.int_thrown_pts

  // Rushing
  pts += (stats.rush_yards ?? 0) * config.rush_yard_pts
  pts += (stats.rush_tds ?? 0) * config.rush_td_pts

  // Receiving
  pts += (stats.receptions ?? 0) * config.reception_pts
  pts += (stats.rec_yards ?? 0) * config.rec_yard_pts
  pts += (stats.rec_tds ?? 0) * config.rec_td_pts

  // 2-pt conversions
  pts += (stats.two_pt_conversions ?? 0) * config.pass_2pt_pts

  // Misc
  pts += (stats.fumbles_lost ?? 0) * config.fumble_lost_pts

  // Yardage bonuses
  if ((stats.pass_yards ?? 0) >= 300) pts += config.bonus_300_pass_yds
  if ((stats.rush_yards ?? 0) >= 100) pts += config.bonus_100_rush_yds
  if ((stats.rec_yards ?? 0) >= 100) pts += config.bonus_100_rec_yds

  return pts
}

// ─── IDP Scoring ─────────────────────────────────────────────────────────────

/**
 * Position-specific IDP multipliers — same base events, different weights
 * to reflect how often each position accumulates each stat type.
 * Keeps all four IDP groups competitively draftable.
 */
const IDP_MULTIPLIERS: Record<'DL' | 'LB' | 'DB', Partial<Record<string, number>>> = {
  DL: { sack: 1.0, qb_hit: 1.0, hurry: 1.0, pass_deflection: 0.67, interception: 0.83 },
  LB: { sack: 0.8, qb_hit: 0.67, hurry: 0.67, pass_deflection: 1.0, interception: 1.0 },
  DB: { sack: 0.6, qb_hit: 0.0, hurry: 0.0, pass_deflection: 1.33, interception: 1.17 },
}

function calculateIDPScore(
  stats: WeeklyStats,
  config: ScoringConfig,
  group: 'DL' | 'LB' | 'DB'
): number {
  const m = IDP_MULTIPLIERS[group]
  let pts = 0

  // Tackles
  pts += (stats.solo_tackles ?? 0) * config.solo_tackle_pts
  pts += (stats.assisted_tackles ?? 0) * config.assisted_tackle_pts

  // Pass rush
  pts += (stats.sacks ?? 0) * config.sack_pts * (m.sack ?? 1)
  pts += (stats.tackles_for_loss ?? 0) * config.tackle_for_loss_pts
  pts += (stats.qb_hits ?? 0) * config.qb_hit_pts * (m.qb_hit ?? 1)
  pts += (stats.qb_hurries ?? 0) * config.qb_hurry_pts * (m.hurry ?? 1)

  // Coverage
  pts += (stats.pass_deflections ?? 0) * config.pass_deflection_pts * (m.pass_deflection ?? 1)
  pts += (stats.interceptions ?? 0) * config.interception_pts * (m.interception ?? 1)

  // Misc
  pts += (stats.forced_fumbles ?? 0) * config.forced_fumble_pts
  pts += (stats.fumble_recoveries ?? 0) * config.fumble_recovery_pts
  pts += (stats.defensive_tds ?? 0) * config.defensive_td_pts
  pts += (stats.safeties ?? 0) * config.safety_pts
  pts += (stats.blocked_kicks ?? 0) * config.blocked_kick_pts

  return pts
}

// ─── Offensive Line Scoring ───────────────────────────────────────────────────

/**
 * OL floor rule: negative events can only reduce down to the base snap points.
 * A lineman who plays 65 snaps and allows 2 sacks scores at least 0 (never negative).
 * This keeps the position fun while still rewarding elite performance.
 */
function calculateOLScore(stats: WeeklyStats, config: ScoringConfig): number {
  const snaps = stats.snaps_played ?? 0

  // Base points from snap count
  let base = 0
  if (snaps >= 60) base = config.ol_base_60_snaps
  else if (snaps >= 40) base = config.ol_base_40_snaps

  // Negative events (floored at 0 — can't go below 0)
  let negatives = 0
  negatives += (stats.sacks_allowed ?? 0) * config.ol_sack_allowed_pts
  negatives += (stats.qb_hits_allowed ?? 0) * config.ol_qb_hit_allowed_pts
  negatives += (stats.hurries_allowed ?? 0) * config.ol_hurry_allowed_pts
  negatives += (stats.penalties ?? 0) * config.ol_penalty_pts

  // Positive events (bonuses on top of base)
  let bonuses = 0
  bonuses += (stats.pancake_blocks ?? 0) * config.ol_pancake_pts
  bonuses += (stats.run_block_wins ?? 0) * config.ol_run_block_win_pts

  // PFF grade bonus
  const grade = stats.pff_grade ?? 0
  if (grade >= 90) bonuses += config.ol_pff_grade_elite
  else if (grade >= 80) bonuses += config.ol_pff_grade_great
  else if (grade >= 70) bonuses += config.ol_pff_grade_good

  // Floor: negatives can only eat into base, never below 0
  const afterNegatives = Math.max(0, base + negatives)
  return afterNegatives + bonuses
}

// ─── Score Breakdown (for UI narrative) ──────────────────────────────────────

export interface ScoreBreakdownLine {
  label: string
  value: string
  points: number
  type: 'base' | 'positive' | 'negative' | 'bonus'
}

export function getScoreBreakdown(
  stats: WeeklyStats,
  player: Pick<Player, 'position' | 'position_group'>,
  config: ScoringConfig
): ScoreBreakdownLine[] {
  const lines: ScoreBreakdownLine[] = []
  const group = player.position_group

  if (group === 'OL') {
    const snaps = stats.snaps_played ?? 0
    const base = snaps >= 60 ? config.ol_base_60_snaps : snaps >= 40 ? config.ol_base_40_snaps : 0
    if (base > 0) lines.push({ label: `Base (${snaps} snaps)`, value: `${snaps} snaps`, points: base, type: 'base' })

    const sacksAllowed = stats.sacks_allowed ?? 0
    if (sacksAllowed) lines.push({ label: `Sack${sacksAllowed > 1 ? 's' : ''} Allowed`, value: `×${sacksAllowed}`, points: sacksAllowed * config.ol_sack_allowed_pts, type: 'negative' })

    const hitsAllowed = stats.qb_hits_allowed ?? 0
    if (hitsAllowed) lines.push({ label: 'QB Hits Allowed', value: `×${hitsAllowed}`, points: hitsAllowed * config.ol_qb_hit_allowed_pts, type: 'negative' })

    const hurriesAllowed = stats.hurries_allowed ?? 0
    if (hurriesAllowed) lines.push({ label: 'Hurries Allowed', value: `×${hurriesAllowed}`, points: hurriesAllowed * config.ol_hurry_allowed_pts, type: 'negative' })

    const penalties = stats.penalties ?? 0
    if (penalties) lines.push({ label: 'Penalties', value: `×${penalties}`, points: penalties * config.ol_penalty_pts, type: 'negative' })

    const pancakes = stats.pancake_blocks ?? 0
    if (pancakes) lines.push({ label: 'Pancake Blocks', value: `×${pancakes}`, points: pancakes * config.ol_pancake_pts, type: 'positive' })

    const grade = stats.pff_grade ?? 0
    if (grade >= 90) lines.push({ label: 'PFF Grade 90+', value: grade.toFixed(1), points: config.ol_pff_grade_elite, type: 'bonus' })
    else if (grade >= 80) lines.push({ label: 'PFF Grade 80–89', value: grade.toFixed(1), points: config.ol_pff_grade_great, type: 'bonus' })
    else if (grade >= 70) lines.push({ label: 'PFF Grade 70–79', value: grade.toFixed(1), points: config.ol_pff_grade_good, type: 'bonus' })
  }

  return lines
}
