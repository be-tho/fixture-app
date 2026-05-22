import { motion } from 'framer-motion'
import { ChevronRight, Clock, MapPin } from 'lucide-react'
import { getArgentinaSchedule } from '../lib/argentinaTime'
import { cn } from '../lib/cn'
import { GROUP_GRADIENT, STAGE_STYLES } from '../lib/groupColors'
import { tw } from '../lib/tw'
import type { ResolvedMatch } from '../types'
import { STAGE_LABELS } from '../types'
import { TeamBadge } from './TeamBadge'

interface MatchCardProps {
  match: ResolvedMatch
  index?: number
  onEditScore?: () => void
}

export function MatchCard({ match, index = 0, onEditScore }: MatchCardProps) {
  const badge =
    match.stage === 'group' && match.group
      ? `Grupo ${match.group}`
      : STAGE_LABELS[match.stage]

  const groupGradient =
    match.group && GROUP_GRADIENT[match.group]
      ? `bg-gradient-to-br ${GROUP_GRADIENT[match.group]}`
      : undefined

  const isFinal = match.stage === 'final'
  const scheduleAR = getArgentinaSchedule(match)

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      onClick={onEditScore}
      className={cn(
        tw.glass,
        'group relative w-full overflow-hidden rounded-2xl p-4 text-left transition-colors',
        'hover:bg-white/[0.08] active:scale-[0.99]',
        match.hasResult && 'ring-1 ring-mint/25',
        isFinal && 'ring-amber-400/25',
      )}
    >
      {isFinal && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"
          aria-hidden
        />
      )}

      <div className="relative mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/40">
          #{match.id}
        </span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            STAGE_STYLES[match.stage],
          )}
        >
          {badge}
        </span>
        {match.hasResult ? (
          <span className="ml-auto rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-bold text-mint">
            Final
          </span>
        ) : scheduleAR.timeDisplay ? (
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-amber-200/90">
            <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
            {scheduleAR.timeDisplay}
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-medium text-white/35">
            Horario TBC
          </span>
        )}
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamBadge
          name={match.homeDisplay}
          align="right"
          accent={groupGradient}
        />
        <div className="flex min-w-[3.5rem] flex-col items-center px-1">
          {match.hasResult ? (
            <span className="text-xl font-black tabular-nums tracking-tight text-white">
              {match.homeScore}
              <span className="mx-0.5 text-white/30">-</span>
              {match.awayScore}
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              vs
            </span>
          )}
        </div>
        <TeamBadge name={match.awayDisplay} accent={groupGradient} />
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-start gap-1.5 text-[11px] leading-snug text-white/45">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-mint/70" strokeWidth={2} />
          <span className="truncate">{match.venue}</span>
        </p>
        <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-mint/70">
          {match.hasResult ? 'Editar' : 'Resultado'}
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  )
}
