import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DraftRoom } from './draft-room'

interface DraftPageProps {
  params: Promise<{ leagueId: string }>
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { leagueId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch draft session
  const { data: session, error } = await supabase
    .from('draft_sessions')
    .select('*')
    .eq('league_id', leagueId)
    .single()

  if (error || !session) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <p className="text-2xl font-black">Draft hasn&apos;t started yet.</p>
        <p className="text-muted-foreground">The commissioner will start the draft shortly.</p>
      </div>
    )
  }

  // Fetch picks with player + team data
  const { data: picks } = await supabase
    .from('draft_picks')
    .select(`*, nfl_players(*), fantasy_teams(id, name, user_id)`)
    .eq('league_id', leagueId)
    .order('overall_pick')

  // Fetch teams
  const { data: teams } = await supabase
    .from('fantasy_teams')
    .select('id, name, user_id, logo_url')
    .eq('league_id', leagueId)

  // Get already drafted IDs
  const draftedIds = new Set((picks ?? []).map(p => p.player_id).filter(Boolean))

  // Fetch available players (sorted by avg_fantasy_pts desc)
  const { data: players } = await supabase
    .from('nfl_players')
    .select('*')
    .eq('is_active', true)
    .not('id', 'in', draftedIds.size > 0 ? `(${[...draftedIds].join(',')})` : '(00000000-0000-0000-0000-000000000000)')
    .order('avg_fantasy_pts', { ascending: false, nullsFirst: false })
    .order('full_name')

  // Find current user's team in this league
  const myTeam = user
    ? teams?.find(t => t.user_id === user.id) ?? null
    : null

  return (
    <DraftRoom
      leagueId={leagueId}
      initialSession={session as any}
      initialPicks={(picks ?? []) as any}
      initialTeams={teams ?? []}
      initialPlayers={players ?? []}
      currentUserId={user?.id ?? ''}
      myTeamId={myTeam?.id ?? null}
    />
  )
}
