'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PickClockProps {
  totalSeconds: number
  pickStartedAt: string | null
  isOnTheClock: boolean
  onExpire?: () => void
}

export function PickClock({ totalSeconds, pickStartedAt, isOnTheClock, onExpire }: PickClockProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    if (!pickStartedAt) {
      setSecondsLeft(totalSeconds)
      return
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(pickStartedAt).getTime()) / 1000)
      const remaining = Math.max(0, totalSeconds - elapsed)
      setSecondsLeft(remaining)
      if (remaining === 0) onExpire?.()
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [pickStartedAt, totalSeconds, onExpire])

  const pct = (secondsLeft / totalSeconds) * 100
  const isLow = secondsLeft <= totalSeconds * 0.25
  const isMid = secondsLeft <= totalSeconds * 0.5

  const barColor = isLow ? '#F87171' : isMid ? '#FBBF24' : '#34D399'
  const textColor = isLow ? '#F87171' : isMid ? '#FBBF24' : '#34D399'

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-2xl font-extrabold tabular-nums w-14 text-right shrink-0"
        style={{ color: textColor, fontFamily: 'var(--font-display)' }}
      >
        {secondsLeft}s
      </span>
      <div className="flex-1">
        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      </div>
      {isOnTheClock && (
        <span
          className="text-[10px] font-bold uppercase tracking-widest animate-pulse shrink-0"
          style={{ color: '#E8A020' }}
        >
          Your Pick
        </span>
      )}
    </div>
  )
}
