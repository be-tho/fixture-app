import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { cn } from '../lib/cn'
import { GROUP_GRADIENT, GROUP_RING } from '../lib/groupColors'
import { tw } from '../lib/tw'
import type { GroupLetter, ResolvedMatch } from '../types'
import { GroupTableCard } from './GroupTableCard'
import { MatchCard } from './MatchCard'
import { ScoreModal } from './ScoreModal'
import { ThirdPlacesMiniTable } from './ThirdPlacesMiniTable'

const GROUPS = 'ABCDEFGHIJKL'.split('') as GroupLetter[]

interface GroupViewProps {
  selectedGroup: GroupLetter
  onSelectGroup: (g: GroupLetter) => void
  onOpenThirds?: () => void
}

export function GroupView({
  selectedGroup,
  onSelectGroup,
  onOpenThirds,
}: GroupViewProps) {
  const {
    resolvedMatches,
    getStandings,
    thirdPlaceCandidates,
  } = useApp()
  const [editing, setEditing] = useState<ResolvedMatch | null>(null)

  const thirdRanks = useMemo(
    () =>
      Object.fromEntries(
        thirdPlaceCandidates.map((c) => [c.team, c.thirdRank]),
      ),
    [thirdPlaceCandidates],
  )

  const matchesForGroup = useMemo(
    () => resolvedMatches.filter((m) => m.group === selectedGroup),
    [resolvedMatches, selectedGroup],
  )

  const playedInGroup = useMemo(() => {
    const rows = getStandings(selectedGroup)
    return rows.reduce((s, r) => s + r.played, 0)
  }, [getStandings, selectedGroup])

  return (
    <div className="space-y-6">
      {/* Selector rápido */}
      <div className="sticky top-0 z-10 -mx-1 space-y-2 bg-surface/80 px-1 py-2 backdrop-blur-md md:static md:bg-transparent md:p-0">
        <div className="flex flex-wrap gap-3 text-[9px] text-white/35">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-mint/40" />
            Top 2 → 16avos
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-amber-400/40" />
            3º en zona (top 8 terceros)
          </span>
        </div>
        <div
          className={cn(tw.scrollbarHide, 'flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible')}
          role="tablist"
          aria-label="Grupos"
        >
          {GROUPS.map((g) => {
            const active = selectedGroup === g
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectGroup(g)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-black transition-all',
                  active
                    ? cn(
                        'bg-gradient-to-br text-white shadow-md',
                        GROUP_GRADIENT[g],
                        GROUP_RING[g],
                        'ring-2',
                      )
                    : cn(tw.glass, 'text-white/45 hover:text-white/75'),
                )}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>

      {/* Todas las tablas — estilo ELNINE */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {GROUPS.map((g) => (
          <GroupTableCard
            key={g}
            group={g}
            rows={getStandings(g)}
            thirdRanks={thirdRanks}
            selected={selectedGroup === g}
            onSelect={() => onSelectGroup(g)}
          />
        ))}
      </div>

      {/* Tabla de terceros resumida */}
      <ThirdPlacesMiniTable onOpenFull={onOpenThirds} />

      {/* Partidos del grupo seleccionado */}
      <AnimatePresence mode="wait">
        <motion.section
          key={selectedGroup}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Partidos · Grupo {selectedGroup}
              </h3>
              <p className="mt-0.5 text-[10px] text-white/35">
                {matchesForGroup.length} partidos · {playedInGroup} PJ registrados en la tabla
              </p>
            </div>
          </div>
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-2">
            {matchesForGroup.map((m, i) => (
              <MatchCard
                key={m.id}
                match={m}
                index={i}
                onEditScore={() => setEditing(m)}
              />
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      <ScoreModal match={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
