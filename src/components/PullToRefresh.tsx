import { Loader2 } from 'lucide-react'
import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from 'react'
import { cn } from '../lib/cn'

const THRESHOLD = 72
const MAX_PULL = 120

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pulling = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (refreshing || window.scrollY > 0) return
    startY.current = e.touches[0].clientY
    pulling.current = true
  }, [refreshing])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!pulling.current || refreshing) return
      const delta = e.touches[0].clientY - startY.current
      if (delta > 0) {
        setPull(Math.min(delta * 0.45, MAX_PULL))
      }
    },
    [refreshing],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return
    pulling.current = false

    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true)
      setPull(THRESHOLD)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
        setPull(0)
      }
    } else {
      setPull(0)
    }
  }, [onRefresh, pull, refreshing])

  const progress = Math.min(pull / THRESHOLD, 1)

  return (
    <div
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pull > 0 || refreshing ? `${Math.max(pull, refreshing ? 48 : 0)}px` : 0 }}
        aria-hidden
      >
        <div
          className="flex items-end pb-2"
          style={{
            opacity: progress,
            transform: `scale(${0.6 + progress * 0.4})`,
          }}
        >
          <Loader2
            className={cn(
              'h-6 w-6 text-mint',
              (refreshing || progress >= 1) && 'animate-spin',
            )}
          />
        </div>
      </div>

      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform:
            pull > 0 || refreshing
              ? `translateY(${refreshing ? 48 : pull}px)`
              : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
