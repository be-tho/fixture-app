import type { GroupLetter, GroupStanding } from '../types'
import { cn } from '../lib/cn'
import type { FormResult } from '../lib/groupForm'
import { GROUP_GRADIENT, GROUP_RING } from '../lib/groupColors'
import { tw } from '../lib/tw'
import { GroupStandings } from './GroupStandings'

interface GroupTableCardProps {
  group: GroupLetter
  rows: GroupStanding[]
  forms: Record<string, FormResult[]>
  thirdRanks: Record<string, number>
  selected?: boolean
  onSelect?: () => void
}

function qualificationNote(rows: GroupStanding[], thirdRanks: Record<string, number>): string {
  const leader = rows[0]
  if (!leader || leader.played === 0) {
    return 'Sin partidos jugados'
  }
  const third = rows[2]
  const thirdQualifies = third && thirdRanks[third.team] != null && thirdRanks[third.team] <= 8
  if (thirdQualifies) {
    return 'Top 2 + 3º en zona de mejores terceros'
  }
  return 'Clasifican los 2 primeros · 3º compite por 8 cupos'
}

export function GroupTableCard({
  group,
  rows,
  forms,
  thirdRanks,
  selected,
  onSelect,
}: GroupTableCardProps) {
  const Wrapper = onSelect ? 'button' : 'div'

  return (
    <Wrapper
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={cn(
        tw.glassStrong,
        'w-full overflow-hidden rounded-2xl text-left ring-1 transition-all',
        GROUP_RING[group],
        selected && 'ring-2 ring-mint/40 shadow-lg shadow-mint/10',
        onSelect && 'hover:bg-white/[0.03] active:scale-[0.995]',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2.5',
          `bg-gradient-to-r ${GROUP_GRADIENT[group]}`,
        )}
      >
        <h3 className="text-sm font-black tracking-tight text-white">
          Grupo {group}
        </h3>
        {rows[0]?.played > 0 && (
          <span className="rounded-md bg-black/20 px-2 py-0.5 text-[9px] font-bold text-white/90">
            Líder: {rows[0].team}
          </span>
        )}
      </div>

      <GroupStandings
        rows={rows}
        forms={forms}
        thirdRanks={thirdRanks}
        compact
      />

      <p className="border-t border-white/5 px-3 py-2 text-[9px] leading-snug text-white/35">
        {qualificationNote(rows, thirdRanks)}
      </p>
    </Wrapper>
  )
}
