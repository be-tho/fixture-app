import { motion } from 'framer-motion'
import { CalendarDays, GitBranch, Info, LayoutGrid, RefreshCw, TrendingUp, Trophy } from 'lucide-react'
import { TOURNAMENT_INFO } from '../constants/tournament'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'
import type { Tab } from './BottomNav'

const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'fixture', label: 'Fixture', icon: CalendarDays },
  { id: 'bracket', label: 'Cuadro', icon: GitBranch },
  { id: 'groups', label: 'Grupos', icon: LayoutGrid },
  { id: 'thirds', label: 'Mejores 3º', icon: TrendingUp },
  { id: 'info', label: 'Info', icon: Info },
]

interface SidebarNavProps {
  active: Tab
  onChange: (tab: Tab) => void
  onRefresh: () => void
}

export function SidebarNav({ active, onChange, onRefresh }: SidebarNavProps) {
  return (
    <aside
      className={cn(
        tw.glassStrong,
        'hidden md:flex md:w-64 md:shrink-0 md:flex-col lg:w-72',
        'border-r border-white/5',
      )}
      aria-label="Navegación lateral"
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-500 shadow-lg shadow-amber-500/25">
          <Trophy className="h-5 w-5 text-slate-900" strokeWidth={2.2} />
          <span className="absolute -bottom-0.5 -right-0.5 rounded bg-slate-900 px-1 py-px text-[8px] font-black text-amber-300">
            26
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-mint/80">
            FIFA World Cup
          </p>
          <p className={cn(tw.textGradientGold, 'text-lg font-extrabold tracking-tight')}>
            Mundial 2026
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Secciones">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                isActive ? 'text-mint' : 'text-white/45 hover:bg-white/5 hover:text-white/70',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-nav-pill"
                  className="absolute inset-0 rounded-xl bg-mint/12 ring-1 ring-mint/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className="relative h-5 w-5 shrink-0"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="relative text-sm font-semibold">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/5 px-5 py-4">
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          {[
            { value: TOURNAMENT_INFO.teams, label: 'equipos' },
            { value: TOURNAMENT_INFO.matches, label: 'partidos' },
            { value: TOURNAMENT_INFO.cities, label: 'sedes' },
          ].map(({ value, label }) => (
            <div key={label} className={cn(tw.glass, 'rounded-lg px-2 py-2')}>
              <span className="text-sm font-bold text-white">{value}</span>
              <span className="block text-[8px] font-medium uppercase tracking-wide text-white/35">
                {label}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-white/80"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizar datos
        </button>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-white/30">
          {TOURNAMENT_INFO.subtitle}
        </p>
      </div>
    </aside>
  )
}
