import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Clock, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { useApp } from './context/AppProvider'
import { FixtureView } from './components/FixtureView'
import { GroupView } from './components/GroupView'
import { Header } from './components/Header'
import { InfoView } from './components/InfoView'
import { TIMEZONE_NOTE } from './lib/argentinaTime'
import { cn } from './lib/cn'
import { tw } from './lib/tw'
import type { GroupLetter } from './types'

type StageFilter = 'all' | 'group' | 'knockout'

const filters: { value: StageFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'group', label: 'Grupos' },
  { value: 'knockout', label: 'Eliminatorias' },
]

function App() {
  const { loading, error } = useApp()
  const [tab, setTab] = useState<Tab>('fixture')
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const [selectedGroup, setSelectedGroup] = useState<GroupLetter>('A')

  if (loading) {
    return (
      <div className={tw.appShell}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-mint" aria-hidden />
          <p className="text-sm text-white/60">Cargando fixture desde Supabase…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={tw.appShell}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertCircle className="h-8 w-8 text-rose-400" aria-hidden />
          <p className="text-sm font-medium text-white/80">No se pudo cargar el torneo</p>
          <p className="text-xs text-white/45">{error}</p>
          <p className="text-[10px] text-white/35">
            Revisá las variables en .env y que ejecutaste setup_completo.sql en Supabase.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={tw.appShell}>
      <Header />

      <AnimatePresence mode="wait">
        {tab === 'fixture' && (
          <motion.div
            key="toolbar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sticky top-0 z-20 px-4 pb-2"
          >
            <div
              className={cn(
                tw.glassStrong,
                'flex items-center gap-2 rounded-2xl px-3 py-2.5',
              )}
            >
              <Search className="h-4 w-4 shrink-0 text-white/35" />
              <input
                type="search"
                placeholder="Equipo, sede, grupo…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                aria-label="Buscar partidos"
              />
            </div>

            <div
              className={cn(tw.scrollbarHide, 'mt-2 flex gap-2 overflow-x-auto')}
              role="group"
              aria-label="Fase del torneo"
            >
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStageFilter(value)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
                    stageFilter === value ? tw.filterActive : tw.filterIdle,
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mt-2 flex items-center gap-1 text-[10px] text-white/35">
              <Clock className="h-3 w-3" />
              {TIMEZONE_NOTE}
            </p>
            <p className="text-[10px] text-mint/60">
              Tocá un partido para cargar el resultado
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'fixture' && (
              <FixtureView query={query} stageFilter={stageFilter} />
            )}
            {tab === 'groups' && (
              <GroupView
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
              />
            )}
            {tab === 'info' && <InfoView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
