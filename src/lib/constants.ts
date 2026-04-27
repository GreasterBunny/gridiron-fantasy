import type { RosterSlot, PositionGroup } from '@/types'

// ─── Roster Configuration ─────────────────────────────────────────────────────

export const ROSTER_SLOTS: { slot: RosterSlot; label: string; count: number }[] = [
  { slot: 'QB',    label: 'Quarterback',    count: 1 },
  { slot: 'RB',    label: 'Running Back',   count: 2 },
  { slot: 'WR',    label: 'Wide Receiver',  count: 2 },
  { slot: 'TE',    label: 'Tight End',      count: 1 },
  { slot: 'FLEX',  label: 'Flex (RB/WR/TE)', count: 1 },
  { slot: 'OL',    label: 'Offensive Line', count: 2 },
  { slot: 'DL',    label: 'Defensive Line', count: 1 },
  { slot: 'LB',    label: 'Linebacker',     count: 2 },
  { slot: 'DB',    label: 'Defensive Back', count: 2 },
  { slot: 'SFLEX', label: 'Super Flex (QB/OL/DL)', count: 1 },
  { slot: 'BN',    label: 'Bench',          count: 7 },
]

export const STARTING_SLOTS = ROSTER_SLOTS.filter(s => s.slot !== 'BN')
export const TOTAL_ROSTER_SIZE = ROSTER_SLOTS.reduce((sum, s) => sum + s.count, 0)

// ─── Position Eligibility by Slot ────────────────────────────────────────────

export const SLOT_ELIGIBILITY: Record<RosterSlot, PositionGroup[]> = {
  QB:    ['QB'],
  RB:    ['RB'],
  WR:    ['WR'],
  TE:    ['TE'],
  FLEX:  ['RB', 'WR', 'TE'],
  OL:    ['OL'],
  DL:    ['DL'],
  LB:    ['LB'],
  DB:    ['DB'],
  SFLEX: ['QB', 'OL', 'DL'],
  BN:    ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB'],
}

// ─── Position Colors ──────────────────────────────────────────────────────────

export const POSITION_COLORS: Record<PositionGroup, string> = {
  QB: 'bg-red-100 text-red-800 border-red-200',
  RB: 'bg-green-100 text-green-800 border-green-200',
  WR: 'bg-blue-100 text-blue-800 border-blue-200',
  TE: 'bg-orange-100 text-orange-800 border-orange-200',
  OL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DL: 'bg-purple-100 text-purple-800 border-purple-200',
  LB: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  DB: 'bg-pink-100 text-pink-800 border-pink-200',
}

// ─── NFL Teams ────────────────────────────────────────────────────────────────

export const NFL_TEAMS = [
  { abbr: 'ARI', name: 'Arizona Cardinals', conference: 'NFC', division: 'West' },
  { abbr: 'ATL', name: 'Atlanta Falcons', conference: 'NFC', division: 'South' },
  { abbr: 'BAL', name: 'Baltimore Ravens', conference: 'AFC', division: 'North' },
  { abbr: 'BUF', name: 'Buffalo Bills', conference: 'AFC', division: 'East' },
  { abbr: 'CAR', name: 'Carolina Panthers', conference: 'NFC', division: 'South' },
  { abbr: 'CHI', name: 'Chicago Bears', conference: 'NFC', division: 'North' },
  { abbr: 'CIN', name: 'Cincinnati Bengals', conference: 'AFC', division: 'North' },
  { abbr: 'CLE', name: 'Cleveland Browns', conference: 'AFC', division: 'North' },
  { abbr: 'DAL', name: 'Dallas Cowboys', conference: 'NFC', division: 'East' },
  { abbr: 'DEN', name: 'Denver Broncos', conference: 'AFC', division: 'West' },
  { abbr: 'DET', name: 'Detroit Lions', conference: 'NFC', division: 'North' },
  { abbr: 'GB',  name: 'Green Bay Packers', conference: 'NFC', division: 'North' },
  { abbr: 'HOU', name: 'Houston Texans', conference: 'AFC', division: 'South' },
  { abbr: 'IND', name: 'Indianapolis Colts', conference: 'AFC', division: 'South' },
  { abbr: 'JAX', name: 'Jacksonville Jaguars', conference: 'AFC', division: 'South' },
  { abbr: 'KC',  name: 'Kansas City Chiefs', conference: 'AFC', division: 'West' },
  { abbr: 'LV',  name: 'Las Vegas Raiders', conference: 'AFC', division: 'West' },
  { abbr: 'LAC', name: 'Los Angeles Chargers', conference: 'AFC', division: 'West' },
  { abbr: 'LAR', name: 'Los Angeles Rams', conference: 'NFC', division: 'West' },
  { abbr: 'MIA', name: 'Miami Dolphins', conference: 'AFC', division: 'East' },
  { abbr: 'MIN', name: 'Minnesota Vikings', conference: 'NFC', division: 'North' },
  { abbr: 'NE',  name: 'New England Patriots', conference: 'AFC', division: 'East' },
  { abbr: 'NO',  name: 'New Orleans Saints', conference: 'NFC', division: 'South' },
  { abbr: 'NYG', name: 'New York Giants', conference: 'NFC', division: 'East' },
  { abbr: 'NYJ', name: 'New York Jets', conference: 'AFC', division: 'East' },
  { abbr: 'PHI', name: 'Philadelphia Eagles', conference: 'NFC', division: 'East' },
  { abbr: 'PIT', name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North' },
  { abbr: 'SF',  name: 'San Francisco 49ers', conference: 'NFC', division: 'West' },
  { abbr: 'SEA', name: 'Seattle Seahawks', conference: 'NFC', division: 'West' },
  { abbr: 'TB',  name: 'Tampa Bay Buccaneers', conference: 'NFC', division: 'South' },
  { abbr: 'TEN', name: 'Tennessee Titans', conference: 'AFC', division: 'South' },
  { abbr: 'WAS', name: 'Washington Commanders', conference: 'NFC', division: 'East' },
]

// ─── Season Config ────────────────────────────────────────────────────────────

export const CURRENT_SEASON = 2025
export const REGULAR_SEASON_WEEKS = 14
export const PLAYOFF_WEEKS = [15, 16, 17]
export const TOTAL_WEEKS = 17
