import { motion } from 'framer-motion'
import {
  CalendarRange,
  ClipboardList,
  Clock,
  ExternalLink,
  Globe2,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { TOURNAMENT_INFO } from '../constants/tournament'
import { TIMEZONE_NOTE } from '../lib/argentinaTime'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'

const cards = [
  {
    icon: CalendarRange,
    title: 'Fechas',
    lines: [`Inicio: ${TOURNAMENT_INFO.start}`, `Final: ${TOURNAMENT_INFO.end}`],
    accent: 'from-sky-500/20 to-blue-600/10',
  },
  {
    icon: Layers,
    title: 'Formato',
    lines: [
      '12 grupos de 4 equipos',
      'Avanzan 2 primeros + 8 mejores terceros',
      'Hasta la final: 8 partidos por equipo',
    ],
    accent: 'from-violet-500/20 to-purple-600/10',
  },
  {
    icon: Clock,
    title: 'Horarios',
    lines: [TIMEZONE_NOTE],
    accent: 'from-mint/20 to-emerald-600/10',
  },
  {
    icon: ClipboardList,
    title: 'Resultados',
    lines: [
      'Tocá cualquier partido para cargar el marcador.',
      'Con todos los grupos completos, los cruces de eliminatorias se llenan solos.',
    ],
    accent: 'from-rose-500/20 to-orange-600/10',
  },
  {
    icon: Globe2,
    title: 'Sedes',
    lines: [
      `${TOURNAMENT_INFO.cities} ciudades anfitrionas`,
      'Canadá · México · Estados Unidos',
    ],
    accent: 'from-emerald-500/20 to-teal-600/10',
  },
] as const

export function InfoView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div
        className={cn(
          tw.glassStrong,
          'relative overflow-hidden rounded-2xl p-5',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-mint/10"
          aria-hidden
        />
        <div className="relative flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {TOURNAMENT_INFO.name}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              La edición más grande de la historia: 48 selecciones y 104
              partidos en Norteamérica.
            </p>
            <p className="mt-2 text-[10px] text-mint/70">
              Fixture, equipos y resultados en Supabase
            </p>
          </div>
        </div>
      </div>

      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className={cn(tw.glass, 'rounded-2xl p-4')}
        >
          <div
            className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${card.accent} p-2.5`}
          >
            <card.icon className="h-5 w-5 text-white/90" strokeWidth={2} />
          </div>
          <h3 className="mb-2 text-sm font-bold text-white">{card.title}</h3>
          <ul className="space-y-1">
            {card.lines.map((line) => (
              <li key={line} className="text-xs leading-relaxed text-white/55">
                {line}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      <div className={cn(tw.glass, 'rounded-2xl p-4')}>
        <div className="mb-2 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-300" />
          <span className="text-xs font-semibold text-white/70">Fuente</span>
        </div>
        <p className="text-xs text-white/45">
          Calendario oficial publicado por FIFA tras el sorteo del 5 de
          diciembre de 2025.
        </p>
        <a
          href={TOURNAMENT_INFO.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(tw.cta, 'mt-4')}
        >
          Ver en FIFA.com
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  )
}
