import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Minus,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useMemo } from 'react'
import { useApp } from '../context/AppProvider'
import { cn } from '../lib/cn'
import { GROUP_GRADIENT, GROUP_RING } from '../lib/groupColors'
import { isArgentinaMatch } from '../lib/matchSchedule'
import type { ThirdPlaceCandidate } from '../lib/thirdPlaces'
import { tw } from '../lib/tw'
import { TeamFlag } from './TeamFlag'

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className={cn(tw.glass, 'rounded-xl px-3 py-3 text-center')}>
      <p
        className={cn(
          'text-xl font-black tabular-nums',
          accent ?? 'text-white',
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/40">
        {label}
      </p>
      {sub && <p className="mt-1 text-[8px] text-white/30">{sub}</p>}
    </div>
  )
}

function PointsBar({ candidate, maxScale }: { candidate: ThirdPlaceCandidate; maxScale: number }) {
  const currentPct = maxScale > 0 ? (candidate.points / maxScale) * 100 : 0
  const maxPct = maxScale > 0 ? (candidate.maxPoints / maxScale) * 100 : 0
  const isArgentina = isArgentinaMatch(candidate.team, '')

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black',
          candidate.qualifies
            ? 'bg-mint/20 text-mint ring-1 ring-mint/30'
            : 'bg-white/5 text-white/40',
        )}
      >
        {candidate.thirdRank}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <TeamFlag name={candidate.team} size="sm" />
          <span className="truncate text-xs font-semibold text-white/90">
            {candidate.team}
          </span>
          <span
            className={cn(
              'shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-black',
              `bg-gradient-to-br text-white ${GROUP_GRADIENT[candidate.group]}`,
            )}
          >
            {candidate.group}
          </span>
          {isArgentina && (
            <span className="shrink-0 text-[9px] font-bold text-sky-300">🇦🇷</span>
          )}
        </div>

        <div className="relative h-5 overflow-hidden rounded-lg bg-black/30">
          {/* Max possible points (ghost bar) */}
          {candidate.remainingMatches > 0 && (
            <div
              className="absolute inset-y-0 left-0 rounded-lg bg-white/[0.06]"
              style={{ width: `${maxPct}%` }}
            />
          )}
          {/* Current points */}
          <motion.div
            layout
            className={cn(
              'absolute inset-y-0 left-0 rounded-lg',
              candidate.qualifies
                ? 'bg-gradient-to-r from-mint/70 to-emerald-500/60'
                : 'bg-gradient-to-r from-white/20 to-white/10',
            )}
            style={{ width: `${currentPct}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <span className="text-[9px] font-bold tabular-nums text-white/90">
              {candidate.points} pts
            </span>
            {candidate.remainingMatches > 0 && (
              <span className="text-[8px] font-medium text-white/45">
                máx {candidate.maxPoints}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[10px] font-bold tabular-nums text-white/70">
          {candidate.played}/{candidate.played + candidate.remainingMatches} PJ
        </p>
        <p className="text-[8px] text-white/35">
          {candidate.remainingMatches > 0
            ? `${candidate.remainingMatches} restantes`
            : 'completo'}
        </p>
      </div>
    </div>
  )
}

function CandidateRow({ candidate }: { candidate: ThirdPlaceCandidate }) {
  const isArgentina = isArgentinaMatch(candidate.team, '')

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'border-b border-white/5 last:border-0 transition-colors',
        candidate.qualifies && 'bg-mint/[0.04]',
        !candidate.qualifies && candidate.thirdRank === 9 && 'bg-rose-500/[0.04]',
        isArgentina && 'ring-1 ring-inset ring-sky-400/15',
      )}
    >
      <td className="px-2 py-2">
        <span
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black',
            candidate.qualifies
              ? 'bg-mint/20 text-mint'
              : 'bg-white/5 text-white/40',
          )}
        >
          {candidate.thirdRank}
        </span>
      </td>
      <td className="px-1 py-2">
        <div className="flex items-center gap-1.5">
          <TeamFlag name={candidate.team} size="sm" />
          <span className="truncate text-[11px] font-semibold text-white/90">
            {candidate.team}
          </span>
        </div>
      </td>
      <td className="px-1 py-2 text-center">
        <span
          className={cn(
            'inline-block rounded-md px-1.5 py-0.5 text-[9px] font-black text-white',
            `bg-gradient-to-br ${GROUP_GRADIENT[candidate.group]}`,
          )}
        >
          {candidate.group}
        </span>
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/60">
        {candidate.played}
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/60">
        {candidate.won}-{candidate.drawn}-{candidate.lost}
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/60">
        {candidate.goalsFor}
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/60">
        {candidate.goalsAgainst}
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/60">
        {candidate.goalDifference > 0 ? '+' : ''}
        {candidate.goalDifference}
      </td>
      <td className="px-1 py-2 text-center text-[10px] font-bold tabular-nums text-mint/90">
        {candidate.points}
      </td>
      <td className="px-1 py-2 text-center text-[10px] tabular-nums text-white/45">
        {candidate.remainingMatches}
      </td>
      <td className="px-2 py-2 text-center">
        {candidate.qualifies ? (
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-mint">
            <CheckCircle2 className="h-3 w-3" />
            Clasifica
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-300/80">
            <XCircle className="h-3 w-3" />
            Fuera
          </span>
        )}
      </td>
    </motion.tr>
  )
}

export function ThirdPlacesView() {
  const { thirdPlaceCandidates, thirdPlaceSlots, groupComplete } = useApp()

  const stats = useMemo(() => {
    const qualified = thirdPlaceCandidates.filter((c) => c.qualifies)
    const withRemaining = thirdPlaceCandidates.filter((c) => c.remainingMatches > 0)
    const assigned = thirdPlaceSlots.filter((s) => s.team).length
    return { qualified, withRemaining, assigned }
  }, [thirdPlaceCandidates, thirdPlaceSlots])

  const maxScale = useMemo(
    () =>
      Math.max(
        9,
        ...thirdPlaceCandidates.map((c) => c.maxPoints),
        ...thirdPlaceCandidates.map((c) => c.points),
      ),
    [thirdPlaceCandidates],
  )

  const cutoffPoints = thirdPlaceCandidates[7]?.points ?? 0
  const bubbleCutoff = thirdPlaceCandidates[8]?.points ?? 0

  return (
    <div className="space-y-6">
      <div
        className={cn(
          tw.glassStrong,
          'relative overflow-hidden rounded-2xl p-4 md:p-5',
        )}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-mint/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/15">
            <TrendingUp className="h-5 w-5 text-mint" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Mejores 8 terceros</h2>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              De 12 grupos salen 12 terceros; los 8 mejores avanzan a dieciseisavos
              según puntos, diferencia de gol y goles marcados.
            </p>
            {groupComplete && (
              <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-mint">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Fase de grupos completa — clasificación definitiva
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Clasifican" value={8} sub="de 12 terceros" accent="text-mint" />
        <StatCard
          label="En zona"
          value={stats.qualified.length}
          sub={`≥ ${cutoffPoints} pts (8º)`}
          accent="text-mint"
        />
        <StatCard
          label="Con partidos"
          value={stats.withRemaining.length}
          sub="aún pueden subir"
        />
        <StatCard
          label="Cruces asignados"
          value={stats.assigned}
          sub="de 8 slots"
        />
      </div>

      {/* Visual points race */}
      <section className={cn(tw.glass, 'rounded-2xl p-4 md:p-5')}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
            Carrera por puntos
          </h3>
          <p className="text-[9px] text-white/35">
            Barra clara = pts actuales · sombra = máximo posible
          </p>
        </div>

        <div className="space-y-3">
          {thirdPlaceCandidates.map((c) => (
            <PointsBar key={`${c.group}-${c.team}`} candidate={c} maxScale={maxScale} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-2">
          <Minus className="h-4 w-4 shrink-0 text-rose-300/80" />
          <p className="text-[10px] text-rose-200/80">
            Línea de corte actual:{' '}
            <strong className="font-bold text-rose-100">
              {cutoffPoints} pts
            </strong>
            {bubbleCutoff < cutoffPoints && (
              <span className="text-rose-200/60">
                {' '}
                · el 9º tiene {bubbleCutoff} pts
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Qualified vs eliminated summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cn(tw.glassStrong, 'rounded-2xl p-4 ring-1 ring-mint/20')}>
          <div className="mb-3 flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-mint" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-mint/90">
              Zona de clasificación (top 8)
            </h3>
          </div>
          <ul className="space-y-2">
            {stats.qualified.map((c) => (
              <motion.li
                key={c.group}
                layout
                className="flex items-center gap-2 rounded-xl bg-mint/5 px-2.5 py-2"
              >
                <span className="text-[10px] font-black text-mint/70">
                  #{c.thirdRank}
                </span>
                <TeamFlag name={c.team} size="sm" />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white/90">
                  {c.team}
                </span>
                <span className="text-[10px] font-bold tabular-nums text-mint">
                  {c.points} pts
                </span>
                {c.assignedMatchId && (
                  <span className="text-[9px] font-mono text-white/35">
                    P{c.assignedMatchId}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className={cn(tw.glass, 'rounded-2xl p-4')}>
          <div className="mb-3 flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-rose-400/80" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300/80">
              Fuera de zona (4 eliminados)
            </h3>
          </div>
          <ul className="space-y-2">
            {thirdPlaceCandidates
              .filter((c) => !c.qualifies)
              .map((c) => (
                <motion.li
                  key={c.group}
                  layout
                  className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-2.5 py-2"
                >
                  <span className="text-[10px] font-black text-white/35">
                    #{c.thirdRank}
                  </span>
                  <TeamFlag name={c.team} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white/60">
                    {c.team}
                  </span>
                  <span className="text-[10px] font-bold tabular-nums text-white/45">
                    {c.points} pts
                  </span>
                  {c.remainingMatches > 0 && (
                    <span className="text-[9px] text-amber-200/70">
                      +{c.remainingMatches} PJ
                    </span>
                  )}
                </motion.li>
              ))}
          </ul>
        </div>
      </div>

      {/* Full table */}
      <section className={cn(tw.glassStrong, 'overflow-hidden rounded-2xl')}>
        <div className="border-b border-white/5 px-4 py-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
            Tabla completa de terceros
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[10px]">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-2 py-2 font-semibold">#</th>
                <th className="px-1 py-2 font-semibold">Equipo</th>
                <th className="px-1 py-2 text-center font-semibold">Gr</th>
                <th className="px-1 py-2 text-center font-semibold">PJ</th>
                <th className="px-1 py-2 text-center font-semibold">G-E-P</th>
                <th className="px-1 py-2 text-center font-semibold">GF</th>
                <th className="px-1 py-2 text-center font-semibold">GC</th>
                <th className="px-1 py-2 text-center font-semibold">DG</th>
                <th className="px-1 py-2 text-center font-semibold">Pts</th>
                <th className="px-1 py-2 text-center font-semibold">Rest.</th>
                <th className="px-2 py-2 text-center font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlaceCandidates.slice(0, 8).map((c) => (
                <CandidateRow key={`${c.group}-${c.team}`} candidate={c} />
              ))}
              <tr className="border-y border-rose-400/20 bg-rose-500/5">
                <td
                  colSpan={11}
                  className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-rose-300/70"
                >
                  — Línea de corte: clasifican los 8 de arriba —
                </td>
              </tr>
              {thirdPlaceCandidates.slice(8).map((c) => (
                <CandidateRow key={`${c.group}-${c.team}`} candidate={c} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-white/5 px-4 py-2 text-[9px] text-white/30">
          Criterio: puntos · diferencia de gol · goles marcados · Rest. = partidos
          de grupo pendientes del 3º
        </p>
      </section>

      {/* Slot assignments */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-300" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
            Asignación a dieciseisavos (8 cruces)
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {thirdPlaceSlots.map((slot) => (
            <div
              key={slot.matchId}
              className={cn(
                tw.glass,
                'rounded-xl p-3 transition-colors',
                slot.team && 'ring-1 ring-mint/20',
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-white/40">
                  Partido #{slot.matchId}
                </span>
                {slot.team ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-mint" />
                ) : (
                  <span className="text-[8px] font-medium text-white/30">Pendiente</span>
                )}
              </div>

              {slot.team ? (
                <div className="flex items-center gap-2">
                  <TeamFlag name={slot.team} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white/90">
                      {slot.team}
                    </p>
                    {slot.group && (
                      <p className="text-[9px] text-white/40">
                        3º Grupo {slot.group}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-white/35">
                  Esperando resultados de grupos elegibles
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-1">
                {slot.groups.map((g) => (
                  <span
                    key={g}
                    className={cn(
                      'rounded px-1 py-0.5 text-[8px] font-bold text-white/70',
                      slot.group === g
                        ? cn(`bg-gradient-to-br ${GROUP_GRADIENT[g]}`, GROUP_RING[g], 'ring-1')
                        : 'bg-white/5',
                    )}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-white/30">
          Cada cruce acepta el 3º de uno de los grupos indicados. FIFA asigna el
          mejor tercero disponible según el ranking y sin repetir grupos.
        </p>
      </section>
    </div>
  )
}
