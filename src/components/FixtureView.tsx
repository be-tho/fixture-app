import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { getArgentinaSchedule } from '../lib/argentinaTime'
import type { ResolvedMatch } from '../types'
import { STAGE_LABELS } from '../types'
import { MatchCard } from './MatchCard'
import { ScoreModal } from './ScoreModal'

type FilterStage = 'all' | 'group' | 'knockout'

interface FixtureViewProps {
  query: string
  stageFilter: FilterStage
}

function matchesFilter(
  m: ResolvedMatch,
  query: string,
  stageFilter: FilterStage,
): boolean {
  const q = query.trim().toLowerCase()
  if (q) {
    const haystack = [
      m.homeDisplay,
      m.awayDisplay,
      m.home,
      m.away,
      m.venue,
      m.group ?? '',
      STAGE_LABELS[m.stage],
      String(m.id),
    ]
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }
  if (stageFilter === 'group') return m.stage === 'group'
  if (stageFilter === 'knockout') return m.stage !== 'group'
  return true
}

export function FixtureView({ query, stageFilter }: FixtureViewProps) {
  const { resolvedMatches, groupComplete } = useApp()
  const [editing, setEditing] = useState<ResolvedMatch | null>(null)

  const filtered = useMemo(
    () =>
      resolvedMatches.filter((m) => matchesFilter(m, query, stageFilter)),
    [resolvedMatches, query, stageFilter],
  )

  const byDate = useMemo(() => {
    const map = new Map<string, { label: string; matches: ResolvedMatch[] }>()
    for (const m of filtered) {
      const ar = getArgentinaSchedule(m)
      const entry = map.get(ar.dateKey)
      if (entry) entry.matches.push(m)
      else map.set(ar.dateKey, { label: ar.dateLabel, matches: [m] })
    }
    for (const entry of map.values()) {
      entry.matches.sort((a, b) => {
        const ta = getArgentinaSchedule(a).time ?? '99:99'
        const tb = getArgentinaSchedule(b).time ?? '99:99'
        return ta.localeCompare(tb)
      })
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <SearchX className="h-8 w-8 text-white/30" />
        </div>
        <p className="text-sm font-medium text-white/60">
          No hay partidos con esa búsqueda
        </p>
        <p className="mt-1 text-xs text-white/35">Probá otro equipo o sede</p>
      </motion.div>
    )
  }

  return (
    <>
      {stageFilter !== 'group' && !groupComplete && (
        <p className="mb-4 rounded-xl bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-200/90">
          Cargá todos los resultados de grupos para completar los cruces de
          eliminatorias.
        </p>
      )}

      <div className="space-y-6">
        {byDate.map(([date, { label, matches }], sectionIndex) => (
          <section key={date}>
            <div className="sticky top-0 z-10 mb-3 flex items-center gap-3 py-1 backdrop-blur-md">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <h3 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.15em] text-mint/90">
                {label}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>
            <div className="space-y-3">
              {matches.map((m, i) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  index={sectionIndex * 4 + i}
                  onEditScore={() => setEditing(m)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <ScoreModal match={editing} onClose={() => setEditing(null)} />
    </>
  )
}
