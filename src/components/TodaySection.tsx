import { motion } from 'framer-motion'
import { Clock, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  formatCountdown,
  getTodayAndUpcoming,
  isArgentinaMatch,
} from '../lib/matchSchedule'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'
import type { ResolvedMatch } from '../types'
import { TeamFlag } from './TeamFlag'

interface TodaySectionProps {
  matches: ResolvedMatch[]
  onSelectMatch: (match: ResolvedMatch) => void
}

function MiniMatchRow({
  match,
  onSelect,
}: {
  match: ResolvedMatch
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2 rounded-xl bg-white/[0.04] px-2.5 py-2 text-left transition hover:bg-white/[0.08] active:scale-[0.99]"
    >
      <TeamFlag name={match.homeDisplay} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-white/85">
        {match.homeDisplay}
      </span>
      <span className="shrink-0 text-[10px] font-bold text-white/35">vs</span>
      <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold text-white/85">
        {match.awayDisplay}
      </span>
      <TeamFlag name={match.awayDisplay} size="sm" />
    </button>
  )
}

export function TodaySection({ matches, onSelectMatch }: TodaySectionProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const { today, next } = useMemo(
    () => getTodayAndUpcoming(matches, now),
    [matches, now],
  )

  if (today.length === 0 && !next) return null

  const nextCountdown =
    next?.kickoffMs != null ? formatCountdown(next.kickoffMs - now) : null
  const nextIsArgentina =
    next != null && isArgentinaMatch(next.homeDisplay, next.awayDisplay)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(tw.glass, 'mb-5 overflow-hidden rounded-2xl p-4')}
    >
      {next && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
              Próximo partido
            </h2>
            {nextIsArgentina && (
              <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-sky-200">
                🇦🇷 Argentina
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectMatch(next)}
            className="w-full rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-3 text-left ring-1 ring-amber-400/20 transition active:scale-[0.99]"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <TeamFlag name={next.homeDisplay} size="sm" />
                <span className="truncate text-sm font-bold text-white">
                  {next.homeDisplay}
                </span>
              </div>
              <span className="text-xs font-black text-white/40">vs</span>
              <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2">
                <TeamFlag name={next.awayDisplay} size="sm" />
                <span className="truncate text-sm font-bold text-white">
                  {next.awayDisplay}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              {next.timeDisplay && (
                <span className="font-semibold text-white/70">
                  {next.timeDisplay}
                </span>
              )}
              {nextCountdown && (
                <span className="flex items-center gap-1 font-bold text-mint">
                  <Clock className="h-3.5 w-3.5" />
                  {nextCountdown}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {today.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-mint" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-mint/90">
              Hoy ({today.length})
            </h2>
          </div>
          <div className="space-y-1.5">
            {today.map((m) => (
              <MiniMatchRow
                key={m.id}
                match={m}
                onSelect={() => onSelectMatch(m)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  )
}
