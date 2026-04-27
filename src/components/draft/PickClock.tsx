'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { getClockColour } from '@/lib/draft-engine'
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
  const colourClass = getClockColour(secondsLeft, totalSeconds)

  return (
    <div className="flex items-center gap-3">
      <span className={cn('text-2xl font-black tabular-nums w-12 text-right', colourClass)}>
        {secondsLeft}s
      </span>
      <div className="flex-1">
        <Progress
          value={pct}
          className={cn(
            'h-2 transition-all',
            secondsLeft <= totalSeconds * 0.25 ? '[&>div]:bg-red-500' :
            secondsLeft <= totalSeconds * 0.5  ? '[&>div]:bg-yellow-500' :
                                                  '[&>div]:bg-green-500'
          )}
        />
      </div>
      {isOnTheClock && (
        <span className="text-xs font-bold text-green-600 animate-pulse">YOUR PICK</span>
      )}
    </div>
  )
}
