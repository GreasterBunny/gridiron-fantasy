import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OFFENSIVE_SCORING = [
  { event: "Passing Yard", pts: "+0.04", note: "25 yds = 1 pt" },
  { event: "Passing TD", pts: "+6", note: "" },
  { event: "Interception Thrown", pts: "−2", note: "" },
  { event: "Rushing Yard", pts: "+0.1", note: "10 yds = 1 pt" },
  { event: "Rushing TD", pts: "+6", note: "" },
  { event: "Reception", pts: "+0.5", note: "Half-PPR" },
  { event: "Receiving Yard", pts: "+0.1", note: "" },
  { event: "Receiving TD", pts: "+6", note: "" },
  { event: "2-Pt Conversion", pts: "+2", note: "" },
  { event: "Fumble Lost", pts: "−2", note: "" },
  { event: "300+ Passing Yard Bonus", pts: "+3", note: "One-time per game" },
  { event: "100+ Rushing Yard Bonus", pts: "+3", note: "One-time per game" },
  { event: "100+ Receiving Yard Bonus", pts: "+3", note: "One-time per game" },
];

const IDP_SCORING = [
  { event: "Solo Tackle", dl: "+1", lb: "+1", db: "+1" },
  { event: "Assisted Tackle", dl: "+0.5", lb: "+0.5", db: "+0.5" },
  { event: "Sack", dl: "+5", lb: "+4", db: "+3" },
  { event: "Tackle for Loss", dl: "+2", lb: "+2", db: "+1.5" },
  { event: "QB Hit", dl: "+1.5", lb: "+1", db: "—" },
  { event: "QB Hurry", dl: "+0.5", lb: "+0.5", db: "—" },
  { event: "Pass Deflection", dl: "+1", lb: "+1.5", db: "+2" },
  { event: "Interception", dl: "+5", lb: "+6", db: "+7" },
  { event: "Forced Fumble", dl: "+3", lb: "+3", db: "+3" },
  { event: "Fumble Recovery", dl: "+2", lb: "+2", db: "+2" },
  { event: "Defensive TD", dl: "+6", lb: "+6", db: "+6" },
  { event: "Safety", dl: "+5", lb: "+5", db: "+5" },
  { event: "Blocked Kick", dl: "+3", lb: "+3", db: "+3" },
];

const OL_SCORING = [
  { event: "Base Points (40–59 snaps)", pts: "+8", type: "base" },
  { event: "Base Points (60+ snaps)", pts: "+10", type: "base" },
  { event: "Sack Allowed", pts: "−3", type: "negative" },
  { event: "QB Hit Allowed", pts: "−1.5", type: "negative" },
  { event: "QB Hurry Allowed", pts: "−0.75", type: "negative" },
  { event: "Penalty (Holding, False Start, etc.)", pts: "−1.5", type: "negative" },
  { event: "Pancake Block", pts: "+2", type: "positive" },
  { event: "Run Block Win (5+ yd gain created)", pts: "+0.5", type: "positive" },
  { event: "PFF Grade 90+ (Elite)", pts: "+4 bonus", type: "bonus" },
  { event: "PFF Grade 80–89 (Great)", pts: "+2 bonus", type: "bonus" },
  { event: "PFF Grade 70–79 (Good)", pts: "+1 bonus", type: "bonus" },
];

const ROSTER_SLOTS = [
  { slot: "QB", count: "1", eligibility: "QB" },
  { slot: "RB", count: "2", eligibility: "RB" },
  { slot: "WR", count: "2", eligibility: "WR" },
  { slot: "TE", count: "1", eligibility: "TE" },
  { slot: "FLEX", count: "1", eligibility: "RB / WR / TE" },
  { slot: "OL", count: "2", eligibility: "LT / LG / C / RG / RT" },
  { slot: "DL", count: "1", eligibility: "DE / DT" },
  { slot: "LB", count: "2", eligibility: "OLB / MLB / ILB" },
  { slot: "DB", count: "2", eligibility: "CB / S / FS / SS" },
  { slot: "SUPER FLEX", count: "1", eligibility: "QB / OL / DL" },
  { slot: "Bench", count: "7", eligibility: "Any position" },
];

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">Gridiron</Link>
          <Link href="/leagues/new" className={buttonVariants({ size: "sm" })}>
            Create League
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Scoring Rules</h1>
          <p className="text-muted-foreground text-lg">
            Designed so every position averages 10–18 fantasy points per game.
            No dead roster slots.
          </p>
        </div>

        <Tabs defaultValue="offense">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="offense">Offense</TabsTrigger>
            <TabsTrigger value="idp">IDP</TabsTrigger>
            <TabsTrigger value="ol">OL</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
          </TabsList>

          {/* Offensive Scoring */}
          <TabsContent value="offense" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Offensive Scoring (QB / RB / WR / TE)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right text-muted-foreground">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OFFENSIVE_SCORING.map((row) => (
                      <TableRow key={row.event}>
                        <TableCell className="font-medium">{row.event}</TableCell>
                        <TableCell className={`text-right font-bold ${row.pts.startsWith("−") ? "text-red-600" : "text-green-600"}`}>
                          {row.pts}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">{row.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IDP Scoring */}
          <TabsContent value="idp" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Individual Defensive Player Scoring</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Position-specific multipliers keep DL, LB, and DB equally draftable.
                  DBs score more for INTs; DLs score more for sacks.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-center">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 border">DL</Badge>
                      </TableHead>
                      <TableHead className="text-center">
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 border">LB</Badge>
                      </TableHead>
                      <TableHead className="text-center">
                        <Badge className="bg-pink-100 text-pink-800 border-pink-200 border">DB</Badge>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IDP_SCORING.map((row) => (
                      <TableRow key={row.event}>
                        <TableCell className="font-medium">{row.event}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">{row.dl}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">{row.lb}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">{row.db}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50">
              <CardContent className="pt-4">
                <p className="text-sm text-indigo-800">
                  <strong>Average weekly output targets:</strong> LB 14–18 pts · DL 10–14 pts · DB 8–12 pts.
                  LBs have the highest floor (most tackles); DBs have the highest ceiling (big INT games).
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OL Scoring */}
          <TabsContent value="ol" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Offensive Line Scoring</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Base snap points + bonuses. Negative events floor at 0 — a lineman can
                  never score below zero, keeping the position fun while still rewarding elite play.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OL_SCORING.map((row) => (
                      <TableRow key={row.event}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {row.event}
                          {row.type === "base" && <Badge variant="secondary" className="text-xs">Base</Badge>}
                          {row.type === "bonus" && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border text-xs">Bonus</Badge>}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${
                          row.pts.startsWith("−") ? "text-red-600" :
                          row.type === "base" ? "text-blue-600" : "text-green-600"
                        }`}>
                          {row.pts}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm font-semibold text-yellow-900">Example game: Trent Williams</p>
                <div className="text-sm text-yellow-800 space-y-1 font-mono">
                  <div className="flex justify-between"><span>Base (67 snaps)</span><span>+10.0</span></div>
                  <div className="flex justify-between"><span>Sack Allowed (×1)</span><span className="text-red-600">−3.0</span></div>
                  <div className="flex justify-between"><span>PFF Grade 88</span><span>+2.0</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold"><span>Total</span><span>9.0 pts</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roster */}
          <TabsContent value="roster" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Roster Structure</CardTitle>
                <p className="text-sm text-muted-foreground">
                  23 total starters. The Super Flex (QB/OL/DL) creates secondary QB scarcity
                  and forces OL/DL into must-draft territory.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slot</TableHead>
                      <TableHead className="text-center">Count</TableHead>
                      <TableHead>Eligible Positions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROSTER_SLOTS.map((row) => (
                      <TableRow key={row.slot} className={row.slot === "SUPER FLEX" ? "bg-yellow-50" : ""}>
                        <TableCell className="font-bold">{row.slot}</TableCell>
                        <TableCell className="text-center">{row.count}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{row.eligibility}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link href="/leagues/new" className={cn(buttonVariants({ size: "lg" }), "bg-slate-950 text-white hover:bg-slate-800")}>
            Start a League with These Rules
          </Link>
        </div>
      </div>
    </div>
  );
}
