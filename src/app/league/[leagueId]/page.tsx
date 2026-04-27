import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LeaguePageProps {
  params: Promise<{ leagueId: string }>
}

const DRAFT_STATUS_BADGE: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-green-100 text-green-800 border-green-200',
  complete:    'bg-slate-100 text-slate-600 border-slate-200',
}

export default async function LeagueLobbyPage({ params }: LeaguePageProps) {
  const { leagueId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [leagueRes, teamsRes, sessionRes] = await Promise.all([
    supabase.from('leagues').select('*').eq('id', leagueId).single(),
    supabase.from('fantasy_teams').select('id, name, user_id, wins, losses, points_for').eq('league_id', leagueId),
    supabase.from('draft_sessions').select('status, current_round, current_pick').eq('league_id', leagueId).maybeSingle(),
  ])

  const league = leagueRes.data
  const teams = teamsRes.data ?? []
  const draftSession = sessionRes.data

  if (!league) {
    return <div className="p-8 text-center text-muted-foreground">League not found.</div>
  }

  const isCommissioner = user?.id === league.commissioner_id
  const myTeam = teams.find(t => t.user_id === user?.id)
  const spotsLeft = league.max_teams - teams.length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Gridiron</Link>
          <div className="flex items-center gap-3">
            {myTeam && (
              <span className="text-sm text-muted-foreground font-medium">{myTeam.name}</span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* League header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tight">{league.name}</h1>
              <Badge className={cn('border', DRAFT_STATUS_BADGE[league.draft_status])}>
                {league.draft_status === 'pending' ? 'Pre-Draft'
                  : league.draft_status === 'in_progress' ? 'Draft Live'
                  : 'Season Active'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Season {league.season} · {teams.length}/{league.max_teams} teams ·{' '}
              {league.is_public ? 'Public' : `Invite code: `}
              {!league.is_public && (
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">
                  {league.invite_code}
                </code>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {league.draft_status === 'in_progress' && (
              <Link
                href={`/draft/${leagueId}`}
                className={cn(buttonVariants(), 'bg-green-600 hover:bg-green-700 font-bold animate-pulse')}
              >
                ⚡ Join Draft
              </Link>
            )}
            {isCommissioner && league.draft_status === 'pending' && teams.length >= 2 && (
              <StartDraftButton leagueId={leagueId} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Teams list */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Teams ({teams.length}/{league.max_teams})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {teams.length === 0 ? (
                  <p className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No teams yet. Share the invite code to get started.
                  </p>
                ) : (
                  <div className="divide-y">
                    {teams.map((team, i) => (
                      <div key={team.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs text-muted-foreground w-5 text-center font-mono">
                          {i + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-slate-100">
                            {team.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{team.name}</p>
                          {league.draft_status === 'complete' && (
                            <p className="text-xs text-muted-foreground">
                              {team.wins}–{team.losses} · {team.points_for.toFixed(1)} pts
                            </p>
                          )}
                        </div>
                        {team.user_id === user?.id && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                        {team.user_id === league.commissioner_id && (
                          <Badge variant="outline" className="text-xs">Commissioner</Badge>
                        )}
                      </div>
                    ))}
                    {spotsLeft > 0 && (
                      <>
                        <Separator />
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                          {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* League info + draft settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Draft Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{league.draft_type} draft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pick clock</span>
                  <span className="font-medium">90 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roster size</span>
                  <span className="font-medium">23 players</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scoring</span>
                  <Link href="/scoring" className="text-blue-600 hover:underline text-xs font-medium">
                    View rules →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {draftSession && league.draft_status === 'in_progress' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4 text-sm space-y-1">
                  <p className="font-bold text-green-800">Draft in progress</p>
                  <p className="text-green-700">
                    Round {draftSession.current_round} · Pick {draftSession.current_pick}
                  </p>
                  <Link
                    href={`/draft/${leagueId}`}
                    className={cn(buttonVariants({ size: 'sm' }), 'w-full mt-2 bg-green-600 hover:bg-green-700')}
                  >
                    Enter Draft Room
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Client component for the start draft button (needs POST)
function StartDraftButton({ leagueId }: { leagueId: string }) {
  return (
    <form action={`/api/draft/${leagueId}/start`} method="POST">
      <button
        type="submit"
        className={cn(buttonVariants(), 'bg-slate-950 hover:bg-slate-800 font-bold')}
      >
        Start Draft
      </button>
    </form>
  )
}
