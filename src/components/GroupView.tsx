import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { cn } from '../lib/cn'
import { GROUP_GRADIENT, GROUP_RING } from '../lib/groupColors'
import { tw } from '../lib/tw'
import type { GroupLetter, ResolvedMatch } from '../types'
import { GroupStandings } from './GroupStandings'
import { MatchCard } from './MatchCard'
import { ScoreModal } from './ScoreModal'

const GROUPS = 'ABCDEFGHIJKL'.split('') as GroupLetter[]

interface GroupViewProps {
  selectedGroup: GroupLetter
  onSelectGroup: (g: GroupLetter) => void
}

export function GroupView({ selectedGroup, onSelectGroup }: GroupViewProps) {
  const { resolvedMatches, getStandings } = useApp()
  const [editing, setEditing] = useState<ResolvedMatch | null>(null)

  const matches = useMemo(
    () => resolvedMatches.filter((m) => m.group === selectedGroup),
    [resolvedMatches, selectedGroup],
  )

  const standings = getStandings(selectedGroup)

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Grupos" className="space-y-2">
        <p className="text-center text-[10px] font-medium text-white/35">
          Elegí un grupo (A–L)
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {GROUPS.map((g) => {
            const active = selectedGroup === g
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Grupo ${g}`}
                onClick={() => onSelectGroup(g)}
                className={cn(
                  'flex aspect-square w-full items-center justify-center rounded-xl text-sm font-black transition-all active:scale-95',
                  active
                    ? cn(
                        'bg-gradient-to-br text-white shadow-lg',
                        GROUP_GRADIENT[g],
                        GROUP_RING[g],
                        'ring-2',
                      )
                    : cn(
                        tw.glass,
                        'text-white/50 hover:bg-white/10 hover:text-white/80',
                      ),
                )}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={selectedGroup}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={cn(
              tw.glassStrong,
              'mb-5 overflow-hidden rounded-2xl p-4 ring-1',
              GROUP_RING[selectedGroup],
            )}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Tabla · Grupo {selectedGroup}
            </p>
            <GroupStandings rows={standings} />
          </div>

          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Partidos · {matches.length}
          </h3>
          <div className="space-y-3">
            {matches.map((m, i) => (
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
