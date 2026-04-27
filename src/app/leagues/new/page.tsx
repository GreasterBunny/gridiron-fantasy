import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewLeaguePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">Gridiron</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Create a League</h1>
          <p className="text-muted-foreground mt-1">Set up your full-roster fantasy league in under a minute.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">League Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">League Name</label>
              <input
                type="text"
                placeholder="e.g. The Gridiron League"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Teams</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                  <option>10 teams</option>
                  <option selected>12 teams</option>
                  <option>14 teams</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Waiver System</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                  <option selected>FAAB ($100)</option>
                  <option>Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Visibility</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50">
                  <input type="radio" name="visibility" value="private" defaultChecked className="accent-slate-900" />
                  <div>
                    <p className="text-sm font-medium">Private</p>
                    <p className="text-xs text-muted-foreground">Invite only</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50">
                  <input type="radio" name="visibility" value="public" className="accent-slate-900" />
                  <div>
                    <p className="text-sm font-medium">Public</p>
                    <p className="text-xs text-muted-foreground">Open to anyone</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2 border rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Scoring Rules</p>
                <Badge variant="secondary">Full-Roster Default</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Half-PPR · OL snap-based · IDP position-weighted · Super Flex (QB/OL/DL).{" "}
                <Link href="/scoring" className="text-blue-600 hover:underline">View full rules →</Link>
              </p>
            </div>

            <Button className="w-full font-bold" size="lg">
              Create League
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll be assigned as commissioner and can invite teams after creation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
