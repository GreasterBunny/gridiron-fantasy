import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/draft/[leagueId]/players?position=QB&search=mahomes&page=0
// Returns available (undrafted) players for the draft pool
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  const { leagueId } = await params
  const supabase = await createClient()
  const url = new URL(req.url)
  const position = url.searchParams.get('position') // position_group filter
  const search = url.searchParams.get('search') ?? ''
  const page = parseInt(url.searchParams.get('page') ?? '0', 10)
  const pageSize = 50

  // Get already drafted player IDs for this league
  const { data: drafted } = await supabase
    .from('draft_picks')
    .select('player_id')
    .eq('league_id', leagueId)
    .not('player_id', 'is', null)

  const draftedIds = (drafted ?? []).map(d => d.player_id!)

  // Build player query
  let query = supabase
    .from('nfl_players')
    .select('id, full_name, first_name, last_name, position, position_group, nfl_team_abbr, injury_status, avg_fantasy_pts, depth_chart_position', { count: 'exact' })
    .eq('is_active', true)
    .order('avg_fantasy_pts', { ascending: false, nullsFirst: false })
    .order('full_name')
    .range(page * pageSize, (page + 1) * pageSize - 1)

  if (draftedIds.length > 0) {
    query = query.not('id', 'in', `(${draftedIds.join(',')})`)
  }

  const VALID_GROUPS = ['QB','RB','WR','TE','OL','DL','LB','DB'] as const
  type PG = typeof VALID_GROUPS[number]
  if (position && position !== 'ALL' && (VALID_GROUPS as readonly string[]).includes(position)) {
    query = query.eq('position_group', position as PG)
  }

  if (search.length >= 2) {
    query = query.ilike('full_name', `%${search}%`)
  }

  const { data: players, error, count } = await query

  if (error) {
    console.error('[draft/players] query error:', error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }

  return NextResponse.json({
    players: players ?? [],
    total: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > (page + 1) * pageSize,
  })
}
