import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const POSITIONS = [
  {
    group: "QB", label: "Quarterback",
    accent: "border-red-500/25 bg-red-500/[0.07]",
    pill: "bg-red-500/15 text-red-400 border-red-500/30",
    description: "Passing yards, TDs, rushing upside",
  },
  {
    group: "RB", label: "Running Back",
    accent: "border-emerald-500/25 bg-emerald-500/[0.07]",
    pill: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Rushing yards, receiving work, TDs",
  },
  {
    group: "WR", label: "Wide Receiver",
    accent: "border-sky-500/25 bg-sky-500/[0.07]",
    pill: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Targets, routes, big-play bonus",
  },
  {
    group: "TE", label: "Tight End",
    accent: "border-orange-500/25 bg-orange-500/[0.07]",
    pill: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    description: "Receiving, red-zone value",
  },
  {
    group: "OL", label: "Offensive Line",
    accent: "border-amber-500/25 bg-amber-500/[0.07]",
    pill: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Snaps, pancakes, zero sacks allowed",
  },
  {
    group: "DL", label: "Defensive Line",
    accent: "border-violet-500/25 bg-violet-500/[0.07]",
    pill: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    description: "Sacks, QB hits, TFL domination",
  },
  {
    group: "LB", label: "Linebacker",
    accent: "border-indigo-500/25 bg-indigo-500/[0.07]",
    pill: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    description: "Tackles, blitzes, coverage plays",
  },
  {
    group: "DB", label: "Defensive Back",
    accent: "border-pink-500/25 bg-pink-500/[0.07]",
    pill: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    description: "INTs, deflections, big-play defense",
  },
]

const FEATURES = [
  { icon: "🏈", title: "Full 53-Man Roster",  description: "Every starting position is draftable. OL, IDP, and skill players all have meaningful fantasy value." },
  { icon: "📊", title: "Balanced Scoring",     description: "A left tackle and a wide receiver average the same weekly points. No throwaway roster slots." },
  { icon: "⚡", title: "Live Scoring",          description: "Real-time updates as sacks are allowed, tackles are made, and pancake blocks are thrown." },
  { icon: "🐍", title: "Snake Draft",           description: "Draft room with position filters, auto-pick, need indicators, and clock pressure." },
  { icon: "💱", title: "Trades + Waivers",      description: "FAAB waiver wire, trade proposals, commissioner veto window — full league management." },
  { icon: "🏆", title: "Playoffs",              description: "Top 6 teams advance. Weeks 15–17 for the championship. Every week matters." },
]

const SCORING_HIGHLIGHTS = [
  { position: "QB",  event: "Passing TD",   pts: "+6",   sub: "300+ yd bonus: +3",      pill: "bg-red-500/15 text-red-400 border-red-500/30" },
  { position: "RB",  event: "Rushing TD",   pts: "+6",   sub: "100+ yd bonus: +3",      pill: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { position: "WR",  event: "Reception",    pts: "+0.5", sub: "Half-PPR + 100 yd bonus", pill: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  { position: "OL",  event: "60-snap game", pts: "+10",  sub: "Sack allowed: −3",        pill: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { position: "DL",  event: "Sack",         pts: "+5",   sub: "QB Hit: +1.5",            pill: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  { position: "LB",  event: "Solo Tackle",  pts: "+1",   sub: "INT: +6, FF: +3",         pill: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  { position: "DB",  event: "Interception", pts: "+7",   sub: "Pass Deflection: +2",     pill: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Nav ──────────────────────────────────────── */}
      <header className="border-b border-white/[0.07] bg-[#08090C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span
            className="text-xl font-display font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gridiron
            <span className="ml-2 text-[10px] font-sans font-semibold tracking-widest uppercase text-[#E8A020] border border-[#E8A020]/40 rounded px-1.5 py-0.5 align-middle">
              Beta
            </span>
          </span>
          <nav className="flex items-center gap-2">
            <Link
              href="/leagues"
              className="text-sm text-[#7C8099] hover:text-white transition-[color] duration-150 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020]"
            >
              Leagues
            </Link>
            <Link
              href="/scoring"
              className="text-sm text-[#7C8099] hover:text-white transition-[color] duration-150 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020]"
            >
              Scoring
            </Link>
            <Link
              href="/leagues/new"
              className="ml-2 text-sm font-bold bg-[#E8A020] text-[#08090C] px-4 py-2 rounded-lg
                hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.97]
                transition-[transform,background-color] duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
            >
              Create League
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────── */}
        <section
          className="grain-overlay relative overflow-hidden py-28 px-4 sm:py-36"
          style={{
            background: `
              radial-gradient(ellipse 90% 55% at 65% -20%, rgba(232,160,32,0.18) 0%, transparent 65%),
              radial-gradient(ellipse 55% 40% at -5% 110%, rgba(232,160,32,0.10) 0%, transparent 60%),
              #08090C
            `,
          }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E8A020]/30 bg-[#E8A020]/[0.08] text-[#E8A020] text-xs font-semibold tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] animate-pulse" />
              Full-Roster Fantasy Football
            </div>

            <h1
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every player.
              <br />
              <span style={{ color: "#E8A020" }}>Every position.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#7C8099] max-w-2xl mx-auto" style={{ lineHeight: "1.75" }}>
              The fantasy football platform that finally gives offensive linemen and
              defensive players the respect they deserve. Draft a left tackle in round&nbsp;3.
              Start a cornerback who picks off two passes. Win with your whole roster.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/leagues/new"
                className="inline-flex items-center justify-center gap-2 text-base font-bold bg-[#E8A020] text-[#08090C] px-8 py-3.5 rounded-xl
                  hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.97]
                  transition-[transform,background-color] duration-150 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
                style={{ boxShadow: "0 4px 24px rgba(232,160,32,0.35), 0 1px 4px rgba(232,160,32,0.20)" }}
              >
                Start a League
              </Link>
              <Link
                href="/scoring"
                className="inline-flex items-center justify-center gap-2 text-base font-semibold text-[#F1F3F9] px-8 py-3.5 rounded-xl border border-white/[0.12] bg-white/[0.05]
                  hover:bg-white/[0.09] hover:border-white/[0.20] active:bg-white/[0.04] active:scale-[0.97]
                  transition-[transform,background-color,border-color] duration-150 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
              >
                View Scoring Rules
              </Link>
            </div>
          </div>
        </section>

        {/* ── Position Grid ─────────────────────────────── */}
        <section className="py-24 px-4 bg-[#08090C]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All 8 position groups. All valuable.
              </h2>
              <p className="text-[#7C8099] mt-3 text-base" style={{ lineHeight: "1.75" }}>
                No throwaway slots. Every position earns its draft cost.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POSITIONS.map((pos) => (
                <div
                  key={pos.group}
                  className={cn("card-hover rounded-xl border p-5 space-y-3 cursor-default", pos.accent)}
                >
                  <span className={cn("inline-block text-xs font-bold px-2 py-0.5 rounded-md border", pos.pill)}>
                    {pos.group}
                  </span>
                  <p className="font-semibold text-[#F1F3F9] text-sm leading-snug">{pos.label}</p>
                  <p className="text-xs text-[#7C8099]" style={{ lineHeight: "1.6" }}>{pos.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Scoring Snapshot ──────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "#0A0B0F" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Scoring built for balance
              </h2>
              <p className="text-[#7C8099] mt-3 text-base" style={{ lineHeight: "1.75" }}>
                Every position averages 10–18 pts/game. No dead weight.
              </p>
            </div>

            <div
              className="rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              <div className="px-5 py-4 border-b border-white/[0.07] bg-[#0F1117]">
                <p className="text-sm font-semibold text-[#F1F3F9]">Key scoring events</p>
              </div>
              <div className="divide-y divide-white/[0.06] bg-[#0F1117]">
                {SCORING_HIGHLIGHTS.map((row, i) => (
                  <div
                    key={row.position}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-[background-color] duration-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border w-9 text-center", row.pill)}>
                        {row.position}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#F1F3F9]">{row.event}</p>
                        <p className="text-xs text-[#7C8099]">{row.sub}</p>
                      </div>
                    </div>
                    <span className="text-base font-black" style={{ color: "#E8A020" }}>{row.pts}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-white/[0.07] bg-[#0F1117] text-center">
                <Link
                  href="/scoring"
                  className="text-sm font-semibold text-[#E8A020] hover:text-[#F0B030] transition-[color] duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
                >
                  View full scoring rules →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────── */}
        <section className="py-24 px-4 bg-[#08090C]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Everything a league needs
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="card-hover rounded-xl border border-white/[0.08] bg-[#0F1117] p-6 space-y-3 cursor-default"
                >
                  <div className="text-2xl">{f.icon}</div>
                  <h3 className="font-bold text-[#F1F3F9] text-sm">{f.title}</h3>
                  <p className="text-sm text-[#7C8099]" style={{ lineHeight: "1.7" }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────── */}
        <section
          className="grain-overlay relative overflow-hidden py-28 px-4 text-center"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,160,32,0.16) 0%, transparent 70%),
              #08090C
            `,
          }}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to draft Trent Williams in round 3?
            </h2>
            <p className="text-[#7C8099] text-lg" style={{ lineHeight: "1.75" }}>
              Start a private league in 60 seconds. Invite up to 12 teams.
            </p>
            <Link
              href="/leagues/new"
              className="inline-flex items-center justify-center text-base font-bold bg-[#E8A020] text-[#08090C] px-10 py-3.5 rounded-xl mt-2
                hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.97]
                transition-[transform,background-color] duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
              style={{ boxShadow: "0 4px 24px rgba(232,160,32,0.35), 0 1px 4px rgba(232,160,32,0.20)" }}
            >
              Create Your League
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] py-8 px-4 bg-[#08090C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span
            className="font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gridiron
          </span>
          <div className="flex gap-6 text-[#7C8099]">
            <Link href="/scoring" className="hover:text-white transition-[color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded">
              Scoring Rules
            </Link>
            <Link href="/leagues" className="hover:text-white transition-[color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded">
              Leagues
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
