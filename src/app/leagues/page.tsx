import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LeaguesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">Gridiron</Link>
          <Link href="/leagues/new" className={buttonVariants({ size: "sm" })}>
            Create League
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-black tracking-tight">Your Leagues</h1>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-10 pb-10 space-y-4">
            <div className="text-5xl">🏈</div>
            <p className="text-muted-foreground">You haven&apos;t joined any leagues yet.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/leagues/new" className={buttonVariants()}>
                Create a League
              </Link>
              <button className={cn(buttonVariants({ variant: "outline" }))}>
                Join with Invite Code
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
