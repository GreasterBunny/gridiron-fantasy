import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const POSITIONS = [
  { group: "QB", label: "Quarterback",    color: "bg-red-100 text-red-800 border-red-200",       description: "Passing yards, TDs, rushing upside" },
  { group: "RB", label: "Running Back",   color: "bg-green-100 text-green-800 border-green-200", description: "Rushing yards, receiving work, TDs" },
  { group: "WR", label: "Wide Receiver",  color: "bg-blue-100 text-blue-800 border-blue-200",    description: "Targets, routes, big-play bonus" },
  { group: "TE", label: "Tight End",      color: "bg-orange-100 text-orange-800 border-orange-200", description: "Receiving, red zone value" },
  { group: "OL", label: "Offensive Line", color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "Snaps, pancakes, zero sacks allowed" },
  { group: "DL", label: "Defensive Line", color: "bg-purple-100 text-purple-800 border-purple-200", description: "Sacks, QB hits, TFL domination" },
  { group: "LB", label: "Linebacker",     color: "bg-indigo-100 text-indigo-800 border-indigo-200", description: "Tackles, blitzes, coverage plays" },
  { group: "DB", label: "Defensive Back", color: "bg-pink-100 text-pink-800 border-pink-200",    description: "INTs, deflections, big-play defense" },
];

const FEATURES = [
  { icon: "🏈", title: "Full 53-Man Roster",   description: "Every starting position is draftable. OL, IDP, and skill players all have meaningful fantasy value." },
  { icon: "📊", title: "Balanced Scoring",      description: "A left tackle and a wide receiver average the same weekly points. No throwaway roster slots." },
  { icon: "⚡", title: "Live Scoring",           description: "Real-time updates as sacks are allowed, tackles are made, and pancake blocks are thrown." },
  { icon: "🐍", title: "Snake Draft",            description: "Draft room with position filters, auto-pick, need indicators, and clock pressure." },
  { icon: "💱", title: "Trades + Waivers",       description: "FAAB waiver wire, trade proposals, commissioner veto window — full league management." },
  { icon: "🏆", title: "Playoffs",               description: "Top 6 teams advance. Weeks 15–17 for the championship. Every week matters." },
];

const SCORING_HIGHLIGHTS = [
  { position: "QB",  event: "Passing TD",     pts: "+6",   sub: "300+ yd bonus: +3" },
  { position: "RB",  event: "Rushing TD",     pts: "+6",   sub: "100+ yd bonus: +3" },
  { position: "WR",  event: "Reception",      pts: "+0.5", sub: "Half-PPR + 100 yd bonus" },
  { position: "OL",  event: "60-snap game",   pts: "+10",  sub: "Sack allowed: -3" },
  { position: "DL",  event: "Sack",           pts: "+5",   sub: "QB Hit: +1.5" },
  { position: "LB",  event: "Solo Tackle",    pts: "+1",   sub: "INT: +6, FF: +3" },
  { position: "DB",  event: "Interception",   pts: "+7",   sub: "Pass Deflection: +2" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tight">
            Gridiron <Badge variant="secondary" className="text-xs ml-1">Beta</Badge>
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/leagues" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Leagues
            </Link>
            <Link href="/scoring" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Scoring
            </Link>
            <Link href="/leagues/new" className={buttonVariants({ size: "sm" })}>
              Create League
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 text-white py-24 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-yellow-400/10 text-yellow-300 border-yellow-400/20 text-sm px-4 py-1">
              Full-Roster Fantasy Football
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
              Every player.<br />
              <span className="text-yellow-400">Every position.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The fantasy football platform that finally gives offensive linemen and
              defensive players the respect they deserve. Draft a left tackle in round 3.
              Start a cornerback who picks off two passes. Win with your whole roster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/leagues/new" className={cn(buttonVariants({ size: "lg" }), "bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold text-base px-8")}>
                Start a League
              </Link>
              <Link href="/scoring" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-slate-700 text-white hover:bg-slate-800 text-base px-8")}>
                View Scoring Rules
              </Link>
            </div>
          </div>
        </section>

        {/* Position Grid */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">All 8 position groups. All valuable.</h2>
              <p className="text-muted-foreground mt-2">No throwaway slots. Every position earns its draft cost.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {POSITIONS.map((pos) => (
                <div key={pos.group} className="rounded-xl border-2 bg-white p-4 space-y-2 hover:shadow-md transition-shadow">
                  <Badge className={`${pos.color} border text-sm font-bold`}>{pos.group}</Badge>
                  <p className="font-semibold text-sm">{pos.label}</p>
                  <p className="text-xs text-muted-foreground">{pos.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scoring Snapshot */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">Scoring built for balance</h2>
              <p className="text-muted-foreground mt-2">Every position averages 10–18 pts/game. No dead weight.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key scoring events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {SCORING_HIGHLIGHTS.map((row) => (
                    <div key={row.position} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-10 text-center font-bold text-xs shrink-0">
                          {row.position}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{row.event}</p>
                          <p className="text-xs text-muted-foreground">{row.sub}</p>
                        </div>
                      </div>
                      <span className="text-base font-black text-green-600">{row.pts}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t text-center">
                  <Link href="/scoring" className="text-sm text-blue-600 hover:underline font-medium">
                    View full scoring rules →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">Everything a league needs</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <Card key={f.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h3 className="font-bold text-base mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-slate-950 text-white text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-black tracking-tight">
              Ready to draft Trent Williams in round 3?
            </h2>
            <p className="text-slate-400 text-lg">
              Start a private league in 60 seconds. Invite up to 12 teams.
            </p>
            <Link href="/leagues/new" className={cn(buttonVariants({ size: "lg" }), "bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold text-base px-10")}>
              Create Your League
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span className="font-black text-foreground">Gridiron</span>
          <div className="flex gap-6">
            <Link href="/scoring" className="hover:text-foreground transition-colors">Scoring Rules</Link>
            <Link href="/leagues" className="hover:text-foreground transition-colors">Leagues</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
