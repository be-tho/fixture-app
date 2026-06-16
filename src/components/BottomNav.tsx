import { motion } from 'framer-motion'
import { CalendarDays, GitBranch, Info, LayoutGrid } from 'lucide-react'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'

export type Tab = 'fixture' | 'bracket' | 'groups' | 'info'

const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'fixture', label: 'Fixture', icon: CalendarDays },
  { id: 'bracket', label: 'Cuadro', icon: GitBranch },
  { id: 'groups', label: 'Grupos', icon: LayoutGrid },
  { id: 'info', label: 'Info', icon: Info },
]

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Navegación principal"
    >
      <div
        className={cn(
          tw.glassStrong,
          'relative flex rounded-2xl p-1 shadow-2xl shadow-black/40',
        )}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors',
                isActive ? 'text-mint' : 'text-white/40 hover:text-white/60',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-mint/15 ring-1 ring-mint/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className="relative h-[18px] w-[18px]"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="relative text-[9px] font-semibold">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
