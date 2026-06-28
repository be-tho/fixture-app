import type { ArgentinaSchedule } from './argentinaTime'

/** Nombres cortos para placeholders del cuadro (más legibles en tarjetas chicas) */
export function formatBracketTeamName(name: string): string {
  const first = name.match(/^1º Grupo ([A-L])$/i)
  if (first) return `1º Grupo ${first[1]}`

  const second = name.match(/^2º Grupo ([A-L])$/i)
  if (second) return `2º Grupo ${second[1]}`

  const third = name.match(/^3º\s+(.+)$/i)
  if (third) return `3º (${third[1].replace(/\//g, '·')})`

  const winner = name.match(/^Ganador P(\d+)$/i)
  if (winner) return `Ganador P${winner[1]}`

  const loser = name.match(/^Perdedor P(\d+)$/i)
  if (loser) return `Perdedor P${loser[1]}`

  return name
}

export function compactScheduleLabel(schedule: ArgentinaSchedule): string | null {
  if (!schedule.timeDisplay) return null

  const parts = schedule.dateLabel.split(' ')
  const dayShort = parts[0]?.slice(0, 3) ?? ''
  const dayNum = parts[1] ?? ''
  const month = parts[2] ?? ''
  const time = schedule.timeDisplay.replace(' hs.', '')

  return `${dayShort} ${dayNum} ${month} · ${time} hs`
}
