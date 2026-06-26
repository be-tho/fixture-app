import { ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { getTeamForm } from '../lib/groupForm'
import { cn } from '../lib/cn'
import { GROUP_GRADIENT } from '../lib/groupColors'
import { tw } from '../lib/tw'
import { FormBadges } from './FormBadges'
import { TeamFlag } from './TeamFlag'

interface ThirdPlacesMiniTableProps {
  onOpenFull?: () => void
}

export function ThirdPlacesMiniTable({ onOpenFull }: ThirdPlacesMiniTableProps) {
  const { thirdPlaceCandidates, matches, results } = useApp()

  return (
    <section className={cn(tw.glassStrong, 'overflow-hidden rounded-2xl')}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
            Tabla de terceros
          </h3>
          <p className="mt-0.5 text-[9px] text-white/35">
            Clasifican los 8 mejores a dieciseisavos
          </p>
        </div>
        {onOpenFull && (
          <button
            type="button"
            onClick={onOpenFull}
            className="flex items-center gap-0.5 text-[10px] font-semibold text-mint/80 hover:text-mint"
          >
            Ver completo
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-[10px]">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="px-2 py-2 font-semibold">#</th>
              <th className="px-1 py-2 font-semibold">Equipo</th>
              <th className="px-1 py-2 text-center font-semibold">Pts</th>
              <th className="px-1 py-2 text-center font-semibold">J</th>
              <th className="px-1 py-2 text-center font-semibold">Gol</th>
              <th className="px-1 py-2 text-center font-semibold">G-E-P</th>
              <th className="px-2 py-2 text-center font-semibold">Últ.</th>
            </tr>
          </thead>
          <tbody>
            {thirdPlaceCandidates.map((c) => {
              const form = getTeamForm(c.team, c.group, matches, results)

              return (
                <tr
                  key={c.group}
                  className={cn(
                    'border-b border-white/5 last:border-0',
                    c.qualifies && 'bg-mint/[0.04]',
                    c.thirdRank === 9 && 'bg-rose-500/[0.03]',
                  )}
                >
                  <td className="px-2 py-1.5 font-bold text-white/50">{c.thirdRank}</td>
                  <td className="px-1 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <TeamFlag name={c.team} size="sm" />
                      <span className="truncate font-semibold text-white/90">{c.team}</span>
                      <span
                        className={cn(
                          'shrink-0 rounded px-1 py-px text-[8px] font-black text-white',
                          `bg-gradient-to-br ${GROUP_GRADIENT[c.group]}`,
                        )}
                      >
                        {c.group}
                      </span>
                    </div>
                  </td>
                  <td className="px-1 py-1.5 text-center font-bold text-mint/90">{c.points}</td>
                  <td className="px-1 py-1.5 text-center text-white/60">{c.played}</td>
                  <td className="px-1 py-1.5 text-center text-white/60">
                    {c.goalsFor}:{c.goalsAgainst}
                    <span
                      className={cn(
                        'ml-0.5 font-semibold',
                        c.goalDifference > 0 ? 'text-mint/80' : 'text-white/40',
                      )}
                    >
                      {c.goalDifference > 0 ? '+' : ''}
                      {c.goalDifference}
                    </span>
                  </td>
                  <td className="px-1 py-1.5 text-center tabular-nums text-white/50">
                    {c.won}-{c.drawn}-{c.lost}
                  </td>
                  <td className="px-2 py-1.5">
                    <FormBadges form={form} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
