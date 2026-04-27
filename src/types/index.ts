// ─── Position Types ───────────────────────────────────────────────────────────

export type OffensivePosition = 'QB' | 'RB' | 'WR' | 'TE'
export type OLinePosition = 'LT' | 'LG' | 'C' | 'RG' | 'RT'
export type DLinePosition = 'DE' | 'DT'
export type LinebackerPosition = 'OLB' | 'MLB' | 'ILB'
export type DBPosition = 'CB' | 'S' | 'FS' | 'SS'

export type NFLPosition =
  | OffensivePosition
  | OLinePosition
  | DLinePosition
  | LinebackerPosition
  | DBPosition

export type PositionGroup = 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'DB'

// ─── Roster Slot Types ────────────────────────────────────────────────────────

export type RosterSlot =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'FLEX'
  | 'OL'
  | 'DL'
  | 'LB'
  | 'DB'
  | 'SFLEX'
  | 'BN'

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string
  sportradar_id?: string
  full_name: string
  first_name: string
  last_name: string
  position: NFLPosition
  position_group: PositionGroup
  nfl_team_abbr: string
  nfl_team_name: string
  jersey_number?: number
  depth_chart_position?: number
  injury_status: 'active' | 'questionable' | 'doubtful' | 'out' | 'ir'
  is_active: boolean
  age?: number
  college?: string
  years_pro?: number
  photo_url?: string
  created_at: string
  updated_at: string
}

// ─── Weekly Stats ─────────────────────────────────────────────────────────────

export interface WeeklyStats {
  id: string
  player_id: string
  week: number
  season: number
  game_id?: string

  // Offensive
  pass_yards?: number
  pass_tds?: number
  pass_attempts?: number
  pass_completions?: number
  interceptions_thrown?: number
  rush_yards?: number
  rush_tds?: number
  rush_attempts?: number
  receptions?: number
  rec_yards?: number
  rec_tds?: number
  targets?: number
  fumbles_lost?: number
  two_pt_conversions?: number

  // Defensive (IDP)
  solo_tackles?: number
  assisted_tackles?: number
  sacks?: number
  tackles_for_loss?: number
  qb_hits?: number
  qb_hurries?: number
  pass_deflections?: number
  interceptions?: number
  forced_fumbles?: number
  fumble_recoveries?: number
  defensive_tds?: number
  safeties?: number
  blocked_kicks?: number

  // Offensive Line
  snaps_played?: number
  sacks_allowed?: number
  qb_hits_allowed?: number
  hurries_allowed?: number
  penalties?: number
  penalty_yards?: number
  pancake_blocks?: number
  run_block_wins?: number
  pff_grade?: number

  // Computed
  fantasy_points?: number
  is_final: boolean
  updated_at: string
}

// ─── Scoring Config ───────────────────────────────────────────────────────────

export interface ScoringConfig {
  // Passing
  pass_yard_pts: number        // per yard
  pass_td_pts: number
  int_thrown_pts: number
  pass_2pt_pts: number

  // Rushing
  rush_yard_pts: number        // per yard
  rush_td_pts: number
  rush_2pt_pts: number

  // Receiving
  reception_pts: number        // half-PPR default: 0.5
  rec_yard_pts: number
  rec_td_pts: number
  rec_2pt_pts: number

  // Misc offense
  fumble_lost_pts: number
  bonus_300_pass_yds: number
  bonus_100_rush_yds: number
  bonus_100_rec_yds: number

  // IDP Tackles
  solo_tackle_pts: number
  assisted_tackle_pts: number

  // IDP Pass Rush
  sack_pts: number
  tackle_for_loss_pts: number
  qb_hit_pts: number
  qb_hurry_pts: number

  // IDP Coverage
  pass_deflection_pts: number
  interception_pts: number
  defensive_td_pts: number

  // IDP Misc
  forced_fumble_pts: number
  fumble_recovery_pts: number
  safety_pts: number
  blocked_kick_pts: number

  // OL Base
  ol_base_40_snaps: number
  ol_base_60_snaps: number

  // OL Negative Events
  ol_sack_allowed_pts: number
  ol_qb_hit_allowed_pts: number
  ol_hurry_allowed_pts: number
  ol_penalty_pts: number

  // OL Positive Events
  ol_pancake_pts: number
  ol_run_block_win_pts: number
  ol_pff_grade_elite: number   // 90+
  ol_pff_grade_great: number   // 80-89
  ol_pff_grade_good: number    // 70-79
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  pass_yard_pts: 0.04,
  pass_td_pts: 6,
  int_thrown_pts: -2,
  pass_2pt_pts: 2,
  rush_yard_pts: 0.1,
  rush_td_pts: 6,
  rush_2pt_pts: 2,
  reception_pts: 0.5,
  rec_yard_pts: 0.1,
  rec_td_pts: 6,
  rec_2pt_pts: 2,
  fumble_lost_pts: -2,
  bonus_300_pass_yds: 3,
  bonus_100_rush_yds: 3,
  bonus_100_rec_yds: 3,
  solo_tackle_pts: 1,
  assisted_tackle_pts: 0.5,
  sack_pts: 5,
  tackle_for_loss_pts: 2,
  qb_hit_pts: 1.5,
  qb_hurry_pts: 0.5,
  pass_deflection_pts: 1.5,
  interception_pts: 6,
  defensive_td_pts: 6,
  forced_fumble_pts: 3,
  fumble_recovery_pts: 2,
  safety_pts: 5,
  blocked_kick_pts: 3,
  ol_base_40_snaps: 8,
  ol_base_60_snaps: 10,
  ol_sack_allowed_pts: -3,
  ol_qb_hit_allowed_pts: -1.5,
  ol_hurry_allowed_pts: -0.75,
  ol_penalty_pts: -1.5,
  ol_pancake_pts: 2,
  ol_run_block_win_pts: 0.5,
  ol_pff_grade_elite: 4,
  ol_pff_grade_great: 2,
  ol_pff_grade_good: 1,
}

// ─── League ───────────────────────────────────────────────────────────────────

export interface League {
  id: string
  name: string
  commissioner_id: string
  is_public: boolean
  season: number
  max_teams: number
  scoring_config: ScoringConfig
  draft_status: 'pending' | 'in_progress' | 'complete'
  draft_date?: string
  draft_type: 'snake'
  waiver_type: 'faab' | 'priority'
  faab_budget: number
  playoff_teams: number
  playoff_start_week: number
  invite_code?: string
  created_at: string
}

// ─── Fantasy Team ─────────────────────────────────────────────────────────────

export interface FantasyTeam {
  id: string
  league_id: string
  user_id: string
  name: string
  logo_url?: string
  waiver_priority: number
  faab_budget: number
  wins: number
  losses: number
  ties: number
  points_for: number
  points_against: number
  created_at: string
}

// ─── Roster Slot ──────────────────────────────────────────────────────────────

export interface RosterEntry {
  id: string
  fantasy_team_id: string
  player_id: string
  player?: Player
  slot_type: RosterSlot
  week: number
  season: number
  is_starter: boolean
  locked_at?: string
}

// ─── Matchup ──────────────────────────────────────────────────────────────────

export interface Matchup {
  id: string
  league_id: string
  week: number
  season: number
  home_team_id: string
  away_team_id: string
  home_team?: FantasyTeam
  away_team?: FantasyTeam
  home_score: number
  away_score: number
  is_final: boolean
  is_playoff: boolean
}

// ─── Draft ────────────────────────────────────────────────────────────────────

export interface DraftPick {
  id: string
  league_id: string
  round: number
  pick_number: number
  overall_pick: number
  fantasy_team_id: string
  player_id?: string
  player?: Player
  picked_at?: string
}

export interface DraftState {
  league_id: string
  status: 'pending' | 'in_progress' | 'complete'
  current_pick: number
  current_round: number
  picks: DraftPick[]
  pick_order: string[]  // fantasy_team_ids in snake order
  time_per_pick_seconds: number
  pick_started_at?: string
}

// ─── Trade ────────────────────────────────────────────────────────────────────

export interface Trade {
  id: string
  league_id: string
  proposing_team_id: string
  receiving_team_id: string
  proposing_team?: FantasyTeam
  receiving_team?: FantasyTeam
  players_offered: Player[]
  players_requested: Player[]
  status: 'pending' | 'accepted' | 'rejected' | 'vetoed'
  proposed_at: string
  processed_at?: string
}

// ─── Waiver ───────────────────────────────────────────────────────────────────

export interface WaiverClaim {
  id: string
  league_id: string
  fantasy_team_id: string
  player_to_add_id: string
  player_to_drop_id?: string
  player_to_add?: Player
  player_to_drop?: Player
  bid_amount: number
  priority: number
  status: 'pending' | 'processed' | 'failed'
  process_date: string
  created_at: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  created_at: string
}
