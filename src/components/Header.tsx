import { motion } from 'framer-motion'
import { Calendar, Cloud, MapPin, Trophy, Users } from 'lucide-react'
import { TOURNAMENT_INFO } from '../constants/tournament'
import { useApp } from '../context/AppProvider'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'

const stats = [
  { icon: Users, value: TOURNAMENT_INFO.teams, label: 'selecciones' },
  { icon: Calendar, value: TOURNAMENT_INFO.matches, label: 'partidos' },
  { icon: MapPin, value: TOURNAMENT_INFO.cities, label: 'sedes' },
] as const

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { loading } = useApp()

  return (
    <header
      className={cn(
        'relative overflow-hidden px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-mint/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-4 top-12 h-28 w-28 rounded-full bg-amber-400/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-start gap-3"
      >
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-500 shadow-lg shadow-amber-500/25">
          <Trophy className="h-7 w-7 text-slate-900" strokeWidth={2.2} />
          <span className="absolute -bottom-1 -right-1 rounded-md bg-slate-900 px-1.5 py-0.5 text-[9px] font-black text-amber-300">
            26
          </span>
        </div>

        <div className="min-w-0 pt-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint/80">
            FIFA World Cup
          </p>
          <h1
            className={cn(
              tw.textGradientGold,
              'text-2xl font-extrabold tracking-tight',
            )}
          >
            Mundial 2026
          </h1>
          <p className="mt-0.5 truncate text-xs text-white/50">
            {TOURNAMENT_INFO.subtitle}
          </p>
          {!loading && (
            <p className="mt-1 flex items-center gap-1 text-[9px] text-white/35">
              <Cloud className="h-3 w-3" />
              Datos en Supabase
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mt-4 flex gap-2"
      >
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className={cn(
              tw.glass,
              'flex flex-1 flex-col items-center rounded-xl px-2 py-2.5',
            )}
          >
            <Icon className="mb-1 h-3.5 w-3.5 text-mint/80" strokeWidth={2.5} />
            <span className="text-sm font-bold text-white">{value}</span>
            <span className="text-[9px] font-medium uppercase tracking-wide text-white/40">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </header>
  )
}
