import { getArgentinaSchedule } from './argentinaTime'
import type { Match, ResolvedMatch } from '../types'

const FIFA_EASTERN_OFFSET = '-04:00'

/** Instant UTC (ms) del kickoff en hora argentina, o null si no hay horario */
export function getMatchKickoffMs(
  match: Pick<Match, 'date' | 'time'>,
): number | null {
  if (!match.time) return null
  return Date.parse(`${match.date}T${match.time}:00${FIFA_EASTERN_OFFSET}`)
}

export function getArgentinaTodayKey(now = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function isArgentinaMatch(home: string, away: string): boolean {
  return /argentina/i.test(home) || /argentina/i.test(away)
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'En curso o finalizado'

  const totalMinutes = Math.floor(ms / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `Arranca en ${days} d ${hours} h`
  }
  if (hours > 0) {
    return `Arranca en ${hours} h ${minutes.toString().padStart(2, '0')} min`
  }
  if (minutes > 0) {
    return `Arranca en ${minutes} min`
  }
  return 'Arranca en menos de 1 min'
}

export interface ScheduledMatch extends ResolvedMatch {
  kickoffMs: number | null
  dateKey: string
  dateLabel: string
  timeDisplay: string | null
}

function toScheduledMatch(match: ResolvedMatch): ScheduledMatch {
  const ar = getArgentinaSchedule(match)
  return {
    ...match,
    kickoffMs: getMatchKickoffMs(match),
    dateKey: ar.dateKey,
    dateLabel: ar.dateLabel,
    timeDisplay: ar.timeDisplay,
  }
}

export function getTodayAndUpcoming(
  matches: ResolvedMatch[],
  now = Date.now(),
): {
  today: ScheduledMatch[]
  next: ScheduledMatch | null
} {
  const todayKey = getArgentinaTodayKey(now)
  const scheduled = matches
    .filter((m) => !m.hasResult)
    .map(toScheduledMatch)
    .filter((m) => m.kickoffMs != null)
    .sort((a, b) => (a.kickoffMs ?? 0) - (b.kickoffMs ?? 0))

  const today = scheduled.filter((m) => m.dateKey === todayKey)
  const next =
    scheduled.find((m) => (m.kickoffMs ?? 0) > now) ?? null

  return { today, next }
}

export function filterArgentinaMatches(matches: ResolvedMatch[]): ResolvedMatch[] {
  return matches.filter((m) =>
    isArgentinaMatch(m.homeDisplay, m.awayDisplay),
  )
}
