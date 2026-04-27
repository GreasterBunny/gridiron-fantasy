import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/draft/[leagueId] — full draft state
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  const { leagueId } = await params
  const supabase = await createClient()

  const [sessionRes, picksRes, teamsRes] = await Promise.all([
    supabase
      .from('draft_sessions')
      .select('*')
      .eq('league_id', leagueId)
      .single(),

    supabase
      .from('draft_picks')
      .select(`
        *,
        nfl_players ( id, full_name, position, position_group, nfl_team_abbr, injury_status ),
        fantasy_teams ( id, name, user_id )
      `)
      .eq('league_id', leagueId)
      .order('overall_pick', { ascending: true }),

    supabase
      .from('fantasy_teams')
      .select('id, name, user_id, logo_url')
      .eq('league_id', leagueId)
      .order('waiver_priority'),
  ])

  if (sessionRes.error) {
    return NextResponse.json({ error: 'Draft session not found' }, { status: 404 })
  }

  return NextResponse.json({
    session: sessionRes.data,
    picks: picksRes.data ?? [],
    teams: teamsRes.data ?? [],
  })
}
