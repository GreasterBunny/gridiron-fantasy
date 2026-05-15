import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LeaguesPage() {
  return (
    <div className="min-h-screen bg-[#08090C]">

      {/* Nav */}
      <header className="border-b border-white/[0.07] bg-[#08090C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gridiron
          </Link>
          <Link
            href="/leagues/new"
            className="text-sm font-bold bg-[#E8A020] text-[#08090C] px-4 py-2 rounded-lg
              hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.97]
              transition-[transform,background-color] duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
          >
            Create League
          </Link>
        </div>
      </header>

      {/* Empty state */}
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center space-y-4">
        <h1
          className="text-4xl font-extrabold tracking-[-0.03em] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your Leagues
        </h1>
        <p className="text-[#7C8099] text-sm mb-4">Join or create a league to get started.</p>

        <div
          className="mt-8 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0F1117] p-10 space-y-6"
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-5xl">🏈</div>
          <p className="text-[#7C8099] text-sm" style={{ lineHeight: "1.75" }}>
            You haven&apos;t joined any leagues yet.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/leagues/new"
              className="w-full text-sm font-bold bg-[#E8A020] text-[#08090C] px-4 py-2.5 rounded-lg text-center
                hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.98]
                transition-[transform,background-color] duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]"
            >
              Create a League
            </Link>
            <button
              className="w-full text-sm font-semibold text-[#F1F3F9] px-4 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04]
                hover:bg-white/[0.08] hover:border-white/[0.20] active:bg-white/[0.03] active:scale-[0.98]
                transition-[transform,background-color,border-color] duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020]"
            >
              Join with Invite Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
