import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSnakePicks, getTotalPicks } from '@/lib/draft-engine'
import { TOTAL_ROSTER_SIZE } from '@/lib/constants'

// POST /api/draft/[leagueId]/start — commissioner starts the draft
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  const { leagueId } = await params
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify caller is commissioner
  const { data: league, error: leagueErr } = await supabase
    .from('leagues')
    .select('id, commissioner_id, max_teams, draft_status')
    .eq('id', leagueId)
    .single()

  if (leagueErr || !league) return NextResponse.json({ error: 'League not found' }, { status: 404 })
  if (league.commissioner_id !== user.id) return NextResponse.json({ error: 'Only the commissioner can start the draft' }, { status: 403 })
  if (league.draft_status !== 'pending') return NextResponse.json({ error: 'Draft already started or complete' }, { status: 400 })

  // Get all teams (randomise draft order)
  const { data: teams } = await supabase
    .from('fantasy_teams')
    .select('id')
    .eq('league_id', leagueId)

  if (!teams || teams.length < 2) {
    return NextResponse.json({ error: 'Need at least 2 teams to start draft' }, { status: 400 })
  }

  // Shuffle team order for randomised draft position
  const teamIds = teams.map(t => t.id).sort(() => Math.random() - 0.5)
  const totalPicks = getTotalPicks(teamIds.length)
  const snakePicks = generateSnakePicks(teamIds, TOTAL_ROSTER_SIZE)

  // Create draft session
  const { data: session, error: sessionErr } = await supabase
    .from('draft_sessions')
    .insert({
      league_id: leagueId,
      status: 'in_progress',
      current_pick: 1,
      current_round: 1,
      pick_order: teamIds,
      time_per_pick_seconds: 90,
      pick_started_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (sessionErr || !session) {
    console.error('[draft/start] session insert error:', sessionErr)
    return NextResponse.json({ error: 'Failed to create draft session' }, { status: 500 })
  }

  // Insert all pick slots upfront (player_id = null until picked)
  const pickRows = snakePicks.map(p => ({
    league_id: leagueId,
    draft_session_id: session.id,
    round: p.round,
    pick_number: p.pick_number,
    overall_pick: p.overall_pick,
    fantasy_team_id: p.fantasy_team_id,
  }))

  const { error: picksErr } = await supabase.from('draft_picks').insert(pickRows)
  if (picksErr) {
    console.error('[draft/start] picks insert error:', picksErr)
    return NextResponse.json({ error: 'Failed to create pick slots' }, { status: 500 })
  }

  // Update league draft_status
  await supabase.from('leagues').update({ draft_status: 'in_progress' }).eq('id', leagueId)

  console.info(`[draft/start] Draft started for league ${leagueId} — ${totalPicks} total picks, ${teamIds.length} teams`)

  return NextResponse.json({ session, totalPicks, teamOrder: teamIds })
}
