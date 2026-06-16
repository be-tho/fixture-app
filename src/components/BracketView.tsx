import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { getArgentinaSchedule } from '../lib/argentinaTime'
import { BRACKET_ROUNDS } from '../lib/bracketLayout'
import { cn } from '../lib/cn'
import { isArgentinaMatch } from '../lib/matchSchedule'
import { tw } from '../lib/tw'
import type { ResolvedMatch } from '../types'
import { STAGE_LABELS } from '../types'
import { ScoreModal } from './ScoreModal'
import { TeamFlag } from './TeamFlag'

function BracketMatchNode({
  match,
  onEdit,
}: {
  match: ResolvedMatch
  onEdit: () => void
}) {
  const schedule = getArgentinaSchedule(match)
  const isFinal = match.stage === 'final'
  const isThird = match.stage === 'third'
  const argentina = isArgentinaMatch(match.homeDisplay, match.awayDisplay)

  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        tw.glass,
        'relative w-[148px] shrink-0 rounded-xl p-2.5 text-left transition hover:bg-white/[0.08] active:scale-[0.98]',
        match.hasResult && 'ring-1 ring-mint/25',
        isFinal && 'ring-1 ring-amber-400/30',
        argentina && 'ring-1 ring-sky-400/25',
      )}
    >
      {(isFinal || isThird) && (
        <span
          className={cn(
            'mb-1.5 block text-center text-[8px] font-black uppercase tracking-wider',
            isFinal ? 'text-amber-300' : 'text-white/45',
          )}
        >
          {STAGE_LABELS[match.stage]}
        </span>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <TeamFlag name={match.homeDisplay} size="sm" />
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold leading-tight text-white/90">
            {match.homeDisplay}
          </span>
          {match.hasResult && (
            <span className="text-[11px] font-black tabular-nums text-mint">
              {match.homeScore}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <TeamFlag name={match.awayDisplay} size="sm" />
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold leading-tight text-white/90">
            {match.awayDisplay}
          </span>
          {match.hasResult && (
            <span className="text-[11px] font-black tabular-nums text-mint">
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-1 border-t border-white/5 pt-1.5">
        <span className="font-mono text-[8px] text-white/30">#{match.id}</span>
        {match.hasResult ? (
          <span className="text-[8px] font-bold uppercase text-mint/80">
            Final
          </span>
        ) : schedule.timeDisplay ? (
          <span className="text-[8px] font-semibold text-amber-200/80">
            {schedule.timeDisplay}
          </span>
        ) : (
          <span className="text-[8px] text-white/30">TBC</span>
        )}
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

      <p className="text-center text-[10px] text-white/35">
        Deslizá horizontalmente · Tocá un partido para cargar resultado
      </p>

      <div className={cn(tw.scrollbarHide, 'overflow-x-auto pb-2')}>
        <div className="flex min-w-max items-stretch gap-0 px-1">
          {BRACKET_ROUNDS.map((round, roundIndex) => {
            const roundMatches = round.matchIds
              .map((id) => byId.get(id))
              .filter((m): m is ResolvedMatch => m != null)

            return (
              <div key={round.stage} className="flex items-stretch">
                {roundIndex > 0 && (
                  <div
                    className="mx-1 w-3 shrink-0 self-stretch bg-gradient-to-r from-white/5 via-white/10 to-white/5"
                    aria-hidden
                  />
                )}

                <div className="flex w-[168px] shrink-0 flex-col">
                  <div className="sticky top-0 z-10 mb-3 rounded-lg bg-surface/80 px-2 py-1.5 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-mint/90">
                      {round.shortLabel}
                    </p>
                    <p className="text-[8px] text-white/35">{round.label}</p>
                  </div>

                  <div className="flex flex-1 flex-col justify-around gap-3 py-1">
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
