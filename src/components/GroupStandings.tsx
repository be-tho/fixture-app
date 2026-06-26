import type { GroupStanding } from '../types'
import { cn } from '../lib/cn'
import { TeamFlag } from './TeamFlag'

interface GroupStandingsProps {
  rows: GroupStanding[]
  thirdRanks?: Record<string, number>
  /** Tabla más densa para grillas de 12 grupos */
  compact?: boolean
}

function rowStatus(
  row: GroupStanding,
  thirdRanks: Record<string, number>,
): { label: string; className: string } | null {
  if (row.played === 0) return null
  if (row.position === 1) {
    return { label: '1°', className: 'text-mint/70' }
  }
  if (row.position === 2) {
    return { label: '2°', className: 'text-mint/60' }
  }
  if (row.position === 3) {
    const rank = thirdRanks[row.team]
    if (rank != null && rank <= 8) {
      return { label: `3° (#${rank})`, className: 'text-amber-200/90' }
    }
    return { label: '3°', className: 'text-amber-200/50' }
  }
  return null
}

export function GroupStandings({
  rows,
  thirdRanks = {},
  compact = false,
}: GroupStandingsProps) {
  const cell = compact ? 'px-1 py-1.5' : 'px-1.5 py-2'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="border-b border-white/10 text-[9px] text-white/40">
            <th className={cn(cell, 'w-6 pl-2 font-semibold')}>#</th>
            <th className={cn(cell, 'min-w-[88px] font-semibold')}>Equipo</th>
            <th className={cn(cell, 'text-center font-semibold')}>Pts</th>
            <th className={cn(cell, 'text-center font-semibold')}>J</th>
            <th className={cn(cell, 'text-center font-semibold')}>Gol</th>
            <th className={cn(cell, 'pr-2 text-center font-semibold')}>G-E-P</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = rowStatus(row, thirdRanks)
            const qualifiesDirect = row.position <= 2 && row.played > 0
            const thirdInZone =
              row.position === 3 &&
              row.played > 0 &&
              thirdRanks[row.team] != null &&
              thirdRanks[row.team] <= 8

            return (
              <tr
                key={row.team}
                className={cn(
                  'border-b border-white/5 last:border-0',
                  qualifiesDirect && 'bg-mint/[0.06]',
                  thirdInZone && 'bg-amber-500/[0.08]',
                  row.position === 4 && row.played > 0 && 'opacity-80',
                )}
              >
                <td className={cn(cell, 'pl-2 font-bold text-white/50')}>
                  {row.position}
                </td>
                <td className={cell}>
                  <div className="flex min-w-0 items-center gap-1.5">
                    <TeamFlag name={row.team} size="sm" />
                    <div className="min-w-0">
                      <span className="block truncate font-semibold leading-tight text-white/90">
                        {row.team}
                      </span>
                      {status && (
                        <span className={cn('text-[8px] font-bold', status.className)}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td
                  className={cn(
                    cell,
                    'text-center text-xs font-black tabular-nums text-mint/90',
                  )}
                >
                  {row.points}
                </td>
                <td className={cn(cell, 'text-center tabular-nums text-white/60')}>
                  {row.played}
                </td>
                <td className={cn(cell, 'text-center tabular-nums text-white/60')}>
                  <span>
                    {row.goalsFor}:{row.goalsAgainst}
                  </span>
                  <span
                    className={cn(
                      'ml-0.5 font-semibold',
                      row.goalDifference > 0
                        ? 'text-mint/75'
                        : row.goalDifference < 0
                          ? 'text-rose-300/70'
                          : 'text-white/35',
                    )}
                  >
                    {row.goalDifference > 0 ? '+' : ''}
                    {row.goalDifference}
                  </span>
                </td>
                <td className={cn(cell, 'pr-2 text-center tabular-nums text-white/50')}>
                  {row.won}-{row.drawn}-{row.lost}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
