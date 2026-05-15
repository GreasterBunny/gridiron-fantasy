import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

interface LeaguePageProps {
  params: Promise<{ leagueId: string }>
}

const DRAFT_STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  pending:     { pill: 'border-amber-500/30 bg-amber-500/10 text-amber-400',       dot: 'bg-amber-400',               label: 'Pre-Draft' },
  in_progress: { pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400 animate-pulse', label: 'Draft Live' },
  complete:    { pill: 'border-white/10 bg-white/5 text-[#7C8099]',                dot: 'bg-[#7C8099]',               label: 'Season Active' },
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
    return (
      <div className="flex items-center justify-center h-screen bg-[#08090C]">
        <p className="text-[#7C8099] text-lg">League not found.</p>
      </div>
    )
  }

  const isCommissioner = user?.id === league.commissioner_id
  const myTeam = teams.find(t => t.user_id === user?.id)
  const spotsLeft = league.max_teams - teams.length
  const statusStyle = DRAFT_STATUS_STYLES[league.draft_status] ?? DRAFT_STATUS_STYLES.pending

  return (
    <div className="min-h-screen bg-[#08090C]">

      {/* Nav */}
      <header className="border-b border-white/[0.07] bg-[#08090C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gridiron
          </Link>
          {myTeam && (
            <span className="text-sm text-[#7C8099] font-medium">{myTeam.name}</span>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* League header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1
                className="text-3xl font-extrabold tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {league.name}
              </h1>
              <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', statusStyle.pill)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                {statusStyle.label}
              </span>
            </div>
            <p className="text-[#7C8099] text-sm">
              Season {league.season} · {teams.length}/{league.max_teams} teams ·{' '}
              {league.is_public ? 'Public' : (
                <>Invite code: <code className="bg-white/[0.07] border border-white/[0.10] px-1.5 py-0.5 rounded font-mono text-xs text-[#F1F3F9] ml-1">{league.invite_code}</code></>
              )}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {league.draft_status === 'in_progress' && (
              <Link
                href={`/draft/${leagueId}`}
                className="text-sm font-bold bg-emerald-500 text-white px-5 py-2.5 rounded-lg
                  hover:bg-emerald-400 active:scale-[0.97] animate-pulse
                  transition-[transform,background-color] duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
                style={{ boxShadow: '0 4px 16px rgba(52,211,153,0.25)' }}
              >
                ⚡ Join Draft
              </Link>
            )}
            {isCommissioner && league.draft_status === 'pending' && teams.length >= 2 && (
              <form action={`/api/draft/${leagueId}/start`} method="POST">
                <button
                  type="submit"
                  className="text-sm font-bold bg-[#E8A020] text-[#08090C] px-5 py-2.5 rounded-lg
                    hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.97]
                    transition-[transform,background-color] duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
                >
                  Start Draft
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Teams list */}
          <div className="md:col-span-2">
            <div
              className="rounded-2xl border border-white/[0.08] bg-[#0F1117] overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}
            >
              <div className="px-5 py-4 border-b border-white/[0.07]">
                <p className="text-sm font-semibold text-[#F1F3F9]">
                  Teams ({teams.length}/{league.max_teams})
                </p>
              </div>
              {teams.length === 0 ? (
                <div className="px-5 py-12 text-center text-[#5A6080] text-sm">
                  No teams yet. Share the invite code to get started.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {teams.map((team, i) => (
                    <div key={team.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-[background-color] duration-100">
                      <span className="text-xs text-[#5A6080] w-5 text-center font-mono tabular-nums">{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-[#161922] border border-white/[0.10] flex items-center justify-center text-xs font-bold text-[#9096B0] shrink-0">
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F1F3F9] truncate">{team.name}</p>
                        {league.draft_status === 'complete' && (
                          <p className="text-xs text-[#7C8099]">
                            {team.wins}–{team.losses} · {team.points_for.toFixed(1)} pts
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {team.user_id === user?.id && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8A020] border border-[#E8A020]/30 rounded px-1.5 py-0.5">
                            You
                          </span>
                        )}
                        {team.user_id === league.commissioner_id && (
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7C8099] border border-white/[0.10] rounded px-1.5 py-0.5">
                            Commish
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {spotsLeft > 0 && (
                    <div className="px-5 py-3.5 text-sm text-[#5A6080] text-center border-t border-dashed border-white/[0.05]">
                      {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div
              className="rounded-2xl border border-white/[0.08] bg-[#0F1117] overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}
            >
              <div className="px-5 py-4 border-b border-white/[0.07]">
                <p className="text-sm font-semibold text-[#F1F3F9]">Draft Settings</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Type',        value: `${league.draft_type} draft` },
                  { label: 'Pick clock',  value: '90 seconds' },
                  { label: 'Roster size', value: '23 players' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-[#7C8099]">{row.label}</span>
                    <span className="text-xs font-semibold text-[#F1F3F9] capitalize">{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#7C8099]">Scoring</span>
                    <Link
                      href="/scoring"
                      className="text-xs font-semibold text-[#E8A020] hover:text-[#F0B030] transition-[color] duration-150"
                    >
                      View rules →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {draftSession && league.draft_status === 'in_progress' && (
              <div
                className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(52,211,153,0.10), 0 0 0 1px rgba(52,211,153,0.15)' }}
              >
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm font-bold text-emerald-400">Draft in progress</p>
                  <p className="text-xs text-emerald-300/70">
                    Round {draftSession.current_round} · Pick {draftSession.current_pick}
                  </p>
                  <Link
                    href={`/draft/${leagueId}`}
                    className="block w-full text-center text-sm font-bold bg-emerald-500 text-white py-2.5 rounded-lg
                      hover:bg-emerald-400 active:scale-[0.97]
                      transition-[transform,background-color] duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Enter Draft Room
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
