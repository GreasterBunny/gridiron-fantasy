import Link from "next/link"

export default function NewLeaguePage() {
  return (
    <div className="min-h-screen bg-[#08090C]">

      {/* Nav */}
      <header className="border-b border-white/[0.07] bg-[#08090C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gridiron
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-14 space-y-8">
        {/* Page header */}
        <div>
          <h1
            className="text-3xl font-extrabold tracking-[-0.03em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create a League
          </h1>
          <p className="text-[#7C8099] mt-1.5 text-sm" style={{ lineHeight: "1.75" }}>
            Set up your full-roster fantasy league in under a minute.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border border-white/[0.08] bg-[#0F1117] overflow-hidden"
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div className="px-6 py-4 border-b border-white/[0.07]">
            <p className="text-sm font-semibold text-[#F1F3F9]">League Setup</p>
          </div>
          <div className="px-6 py-6 space-y-6">

            {/* League name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#9096B0] uppercase tracking-widest">
                League Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Gridiron League"
                className="w-full bg-[#161922] border border-white/[0.10] rounded-lg px-4 py-2.5 text-sm text-[#F1F3F9]
                  placeholder:text-[#5A6080]
                  focus:outline-none focus:ring-2 focus:ring-[#E8A020] focus:border-transparent
                  transition-[box-shadow,border-color] duration-150"
              />
            </div>

            {/* Teams + Waiver */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#9096B0] uppercase tracking-widest">
                  Teams
                </label>
                <select
                  className="w-full bg-[#161922] border border-white/[0.10] rounded-lg px-4 py-2.5 text-sm text-[#F1F3F9]
                    focus:outline-none focus:ring-2 focus:ring-[#E8A020] focus:border-transparent
                    transition-[box-shadow,border-color] duration-150 cursor-pointer appearance-none"
                >
                  <option value="10">10 teams</option>
                  <option value="12">12 teams</option>
                  <option value="14">14 teams</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#9096B0] uppercase tracking-widest">
                  Waiver System
                </label>
                <select
                  className="w-full bg-[#161922] border border-white/[0.10] rounded-lg px-4 py-2.5 text-sm text-[#F1F3F9]
                    focus:outline-none focus:ring-2 focus:ring-[#E8A020] focus:border-transparent
                    transition-[box-shadow,border-color] duration-150 cursor-pointer appearance-none"
                >
                  <option value="faab">FAAB ($100)</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#9096B0] uppercase tracking-widest">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "private", label: "Private", sub: "Invite only", default: true },
                  { value: "public", label: "Public", sub: "Open to anyone", default: false },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 border border-white/[0.10] rounded-xl p-3.5 cursor-pointer
                      bg-[#161922] hover:bg-[#1C2030] hover:border-white/[0.18]
                      has-[:checked]:border-[#E8A020]/50 has-[:checked]:bg-[#E8A020]/[0.07]
                      transition-[background-color,border-color] duration-150"
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.value}
                      defaultChecked={opt.default}
                      className="accent-[#E8A020] w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#F1F3F9]">{opt.label}</p>
                      <p className="text-xs text-[#7C8099]">{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Scoring info */}
            <div className="rounded-xl border border-[#E8A020]/20 bg-[#E8A020]/[0.06] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#F1F3F9]">Scoring Rules</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8A020] border border-[#E8A020]/30 rounded px-1.5 py-0.5">
                  Full-Roster Default
                </span>
              </div>
              <p className="text-xs text-[#7C8099]" style={{ lineHeight: "1.7" }}>
                Half-PPR · OL snap-based · IDP position-weighted · Super Flex (QB/OL/DL).{" "}
                <Link
                  href="/scoring"
                  className="text-[#E8A020] hover:text-[#F0B030] transition-[color] duration-150"
                >
                  View full rules →
                </Link>
              </p>
            </div>

            {/* Submit */}
            <button
              type="button"
              className="w-full text-base font-bold bg-[#E8A020] text-[#08090C] py-3 rounded-xl
                hover:bg-[#F0B030] active:bg-[#D09018] active:scale-[0.98]
                transition-[transform,background-color] duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]"
              style={{ boxShadow: "0 4px 16px rgba(232,160,32,0.25)" }}
            >
              Create League
            </button>

            <p className="text-xs text-center text-[#5A6080]">
              You&apos;ll be assigned as commissioner and can invite teams after creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
