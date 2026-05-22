import type { GroupStanding } from '../types'
import { cn } from '../lib/cn'
import { TeamFlag } from './TeamFlag'

interface GroupStandingsProps {
  rows: GroupStanding[]
}

export function GroupStandings({ rows }: GroupStandingsProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-black/20">
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            <th className="px-2 py-1.5 font-semibold">#</th>
            <th className="px-1 py-1.5 font-semibold">Equipo</th>
            <th className="px-1 py-1.5 text-center font-semibold">PJ</th>
            <th className="px-1 py-1.5 text-center font-semibold">DG</th>
            <th className="px-2 py-1.5 text-center font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team}
              className={cn(
                'border-b border-white/5 last:border-0',
                row.position <= 2 && 'bg-mint/5',
                row.position === 3 && 'bg-amber-500/5',
              )}
            >
              <td className="px-2 py-1.5 font-bold text-white/50">
                {row.position}
              </td>
              <td className="px-1 py-1">
                <div className="flex items-center gap-1.5">
                  <TeamFlag name={row.team} size="sm" />
                  <span className="truncate font-semibold text-white/90">
                    {row.team}
                  </span>
                </div>
              </td>
              <td className="px-1 py-1.5 text-center text-white/60">
                {row.played}
              </td>
              <td className="px-1 py-1.5 text-center text-white/60">
                {row.goalDifference > 0 ? '+' : ''}
                {row.goalDifference}
              </td>
              <td className="px-2 py-1.5 text-center font-bold text-mint/90">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-2 py-1.5 text-[9px] text-white/30">
        Top 2 clasifican · 3º puede avanzar (mejores 8 terceros)
      </p>
    </div>
  )
}
