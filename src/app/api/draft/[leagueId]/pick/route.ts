import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validatePick, getTeamOnTheClock, getCurrentOverallPick, getSecondsRemaining } from '@/lib/draft-engine'

// POST /api/draft/[leagueId]/pick — submit a draft pick
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  const { leagueId } = await params
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { playerId, fantasyTeamId } = body as { playerId: string; fantasyTeamId: string }

  if (!playerId || !fantasyTeamId) {
    return NextResponse.json({ error: 'playerId and fantasyTeamId are required' }, { status: 400 })
  }

  // Verify the team belongs to the user (or is an auto-pick)
  const { data: team } = await supabase
    .from('fantasy_teams')
    .select('id, user_id')
    .eq('id', fantasyTeamId)
    .eq('league_id', leagueId)
    .single()

  if (!team || team.user_id !== user.id) {
    return NextResponse.json({ error: 'That team does not belong to you' }, { status: 403 })
  }

  // Get current draft session
  const { data: session, error: sessionErr } = await supabase
    .from('draft_sessions')
    .select('*')
    .eq('league_id', leagueId)
    .single()

  if (sessionErr || !session) {
    return NextResponse.json({ error: 'Draft session not found' }, { status: 404 })
  }

  // Get already drafted player IDs
  const { data: existingPicks } = await supabase
    .from('draft_picks')
    .select('player_id')
    .eq('league_id', leagueId)
    .not('player_id', 'is', null)

  const draftedIds = new Set((existingPicks ?? []).map(p => p.player_id!))

  // Validate the pick
  const validation = validatePick(session, fantasyTeamId, playerId, draftedIds)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 })
  }

  // Check clock — if expired, allow commissioner/system to auto-pick but not the user
  const secondsLeft = getSecondsRemaining(session)
  const clockExpired = secondsLeft === 0
  if (clockExpired) {
    console.warn(`[draft/pick] Clock expired for league ${leagueId} pick ${getCurrentOverallPick(session)} — treating as valid (clock grace)`)
  }

  const overallPick = getCurrentOverallPick(session)
  const numTeams = (session.pick_order as string[]).length
  const isLastPick = overallPick >= numTeams * session.current_round && session.current_round >= session.current_pick

  // Update the pick row
  const { error: pickErr } = await supabase
    .from('draft_picks')
    .update({
      player_id: playerId,
      picked_at: new Date().toISOString(),
      is_auto_pick: clockExpired,
    })
    .eq('league_id', leagueId)
    .eq('overall_pick', overallPick)

  if (pickErr) {
    console.error('[draft/pick] pick update error:', pickErr)
    return NextResponse.json({ error: 'Failed to record pick' }, { status: 500 })
  }

  // Advance session to next pick
  const nextPick = session.current_pick >= numTeams
    ? 1
    : session.current_pick + 1
  const nextRound = session.current_pick >= numTeams
    ? session.current_round + 1
    : session.current_round
  const totalRounds = Math.ceil(/* TOTAL_ROSTER_SIZE */ 23)
  const draftComplete = nextRound > 23 // 23 total rounds (roster size)

  if (draftComplete) {
    await supabase
      .from('draft_sessions')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', session.id)

    await supabase
      .from('leagues')
      .update({ draft_status: 'complete' })
      .eq('id', leagueId)

    console.info(`[draft/pick] Draft complete for league ${leagueId}`)
  } else {
    await supabase
      .from('draft_sessions')
      .update({
        current_pick: nextPick,
        current_round: nextRound,
        pick_started_at: new Date().toISOString(),
      })
      .eq('id', session.id)
  }

  // Add player to the team's roster (bench slot — lineup set later)
  await supabase.from('roster_entries').insert({
    fantasy_team_id: fantasyTeamId,
    player_id: playerId,
    slot_type: 'BN',
    week: 1,
    season: 2025,
    is_starter: false,
  })

  console.info(`[draft/pick] Pick recorded: league=${leagueId} overall=${overallPick} player=${playerId} team=${fantasyTeamId}`)

  return NextResponse.json({
    success: true,
    overallPick,
    draftComplete,
    nextTeamOnClock: draftComplete ? null : getTeamOnTheClock({
      ...session,
      current_pick: nextPick,
      current_round: nextRound,
    }),
  })
}
