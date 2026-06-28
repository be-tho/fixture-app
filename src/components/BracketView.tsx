import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { getArgentinaSchedule } from '../lib/argentinaTime'
import { BRACKET_ROUNDS } from '../lib/bracketLayout'
import {
  compactScheduleLabel,
  formatBracketTeamName,
} from '../lib/bracketDisplay'
import { cn } from '../lib/cn'
import { isArgentinaMatch } from '../lib/matchSchedule'
import { tw } from '../lib/tw'
import type { ResolvedMatch } from '../types'
import { STAGE_LABELS } from '../types'
import { ScoreModal } from './ScoreModal'
import { TeamFlag } from './TeamFlag'

function BracketTeamRow({
  name,
  score,
  hasResult,
  isWinner,
  isArgentinaTeam,
}: {
  name: string
  score: number | null
  hasResult: boolean
  isWinner: boolean
  isArgentinaTeam: boolean
}) {
  const label = formatBracketTeamName(name)

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        isWinner && 'bg-mint/[0.07]',
        isArgentinaTeam && !isWinner && 'bg-sky-500/[0.06]',
      )}
    >
      <TeamFlag name={name} size="sm" />
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-[11px] leading-snug',
          isWinner
            ? 'font-bold text-white'
            : 'font-semibold text-white/90',
        )}
        title={name}
      >
        {label}
      </span>
      {hasResult && score != null && (
        <span
          className={cn(
            'min-w-[1.25rem] text-right text-sm font-black tabular-nums',
            isWinner ? 'text-mint' : 'text-white/45',
          )}
        >
          {score}
        </span>
      )}
    </div>
  )
}

function BracketMatchNode({
  match,
  onEdit,
}: {
  match: ResolvedMatch
  onEdit: () => void
}) {
  const schedule = getArgentinaSchedule(match)
  const scheduleLabel = compactScheduleLabel(schedule)
  const isFinal = match.stage === 'final'
  const isThird = match.stage === 'third'
  const argentina = isArgentinaMatch(match.homeDisplay, match.awayDisplay)
  const homeWon =
    match.hasResult &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.homeScore > match.awayScore
  const awayWon =
    match.hasResult &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.awayScore > match.homeScore
  const homeIsArgentina = /argentina/i.test(match.homeDisplay)
  const awayIsArgentina = /argentina/i.test(match.awayDisplay)

  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        tw.glass,
        'group relative w-full shrink-0 overflow-hidden rounded-xl text-left transition',
        'hover:bg-white/[0.08] active:scale-[0.98]',
        match.hasResult && 'ring-1 ring-mint/25',
        isFinal && 'ring-1 ring-amber-400/35',
        isThird && 'ring-1 ring-white/10',
        argentina && !match.hasResult && 'ring-1 ring-sky-400/30',
      )}
    >
      {isFinal && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"
          aria-hidden
        />
      )}

      <div className="relative flex items-center justify-between gap-2 border-b border-white/5 px-3 py-1.5">
        {(isFinal || isThird) ? (
          <span
            className={cn(
              'text-[9px] font-black uppercase tracking-wider',
              isFinal ? 'text-amber-300' : 'text-white/45',
            )}
          >
            {STAGE_LABELS[match.stage]}
          </span>
        ) : (
          <span className="font-mono text-[9px] font-medium text-white/35">
            P{match.id}
          </span>
        )}

        {match.hasResult ? (
          <span className="rounded-full bg-mint/15 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-mint">
            Final
          </span>
        ) : scheduleLabel ? (
          <span className="flex items-center gap-1 text-[9px] font-semibold tabular-nums text-amber-200/90">
            <Clock className="h-3 w-3 shrink-0 opacity-80" strokeWidth={2.5} />
            {scheduleLabel}
          </span>
        ) : (
          <span className="text-[9px] text-white/30">Horario TBC</span>
        )}
      </div>

      <div className="divide-y divide-white/[0.06]">
        <BracketTeamRow
          name={match.homeDisplay}
          score={match.homeScore}
          hasResult={match.hasResult}
          isWinner={homeWon}
          isArgentinaTeam={homeIsArgentina}
        />
        <BracketTeamRow
          name={match.awayDisplay}
          score={match.awayScore}
          hasResult={match.hasResult}
          isWinner={awayWon}
          isArgentinaTeam={awayIsArgentina}
        />
      </div>
    </button>
  )
}

export function BracketView() {
  const { resolvedMatches, groupComplete } = useApp()
  const [editing, setEditing] = useState<ResolvedMatch | null>(null)

  const byId = useMemo(
    () => new Map(resolvedMatches.map((m) => [m.id, m])),
    [resolvedMatches],
  )

  return (
    <div className="space-y-4">
      {!groupComplete && (
        <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-200/90">
          Completá los grupos para ver los equipos reales en el cuadro.
        </p>
      )}

      <p className="text-center text-[10px] text-white/35 md:text-xs">
        <span className="md:hidden">Deslizá horizontalmente · </span>
        <span className="hidden md:inline">Clic en un partido para cargar resultado</span>
        <span className="md:hidden">Tocá un partido para cargar resultado</span>
      </p>

      <div
        className={cn(
          tw.scrollbarHide,
          'overflow-x-auto pb-2 md:flex md:justify-center md:overflow-x-visible',
        )}
      >
        <div className="flex min-w-max items-stretch gap-0 px-1 md:min-w-0 md:gap-1">
          {BRACKET_ROUNDS.map((round, roundIndex) => {
            const roundMatches = round.matchIds
              .map((id) => byId.get(id))
              .filter((m): m is ResolvedMatch => m != null)
            const isRound32 = round.stage === 'round32'

            return (
              <div key={round.stage} className="flex items-stretch">
                {roundIndex > 0 && (
                  <div
                    className="mx-1 w-3 shrink-0 self-stretch bg-gradient-to-r from-white/5 via-white/10 to-white/5"
                    aria-hidden
                  />
                )}

                <div
                  className={cn(
                    'flex shrink-0 flex-col',
                    isRound32
                      ? 'w-[200px] md:w-[212px] lg:w-[224px]'
                      : 'w-[188px] md:w-[200px] lg:w-[212px]',
                  )}
                >
                  <div className="sticky top-0 z-10 mb-3 rounded-lg bg-surface/80 px-2 py-1.5 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-mint/90">
                      {round.shortLabel}
                    </p>
                    <p className="text-[8px] text-white/35">{round.label}</p>
                  </div>

                  <div
                    className={cn(
                      'flex flex-1 flex-col justify-around py-1',
                      isRound32 ? 'gap-2' : 'gap-3',
                    )}
                  >
                    {roundMatches.map((match, i) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: roundIndex * 0.05 + i * 0.02 }}
                      >
                        <BracketMatchNode
                          match={match}
                          onEdit={() => setEditing(match)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ScoreModal match={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
