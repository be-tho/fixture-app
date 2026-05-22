import type { Match } from '../types'

/** Argentina no usa horario de verano (siempre UTC-3) */
export const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires'

/** FIFA publica horarios en hora del Este de EE. UU. (EDT en junio–julio) */
const FIFA_EASTERN_OFFSET = '-04:00'

export const TIMEZONE_NOTE = 'Todos los horarios en hora argentina'

export interface ArgentinaSchedule {
  dateKey: string
  dateLabel: string
  time: string | null
  timeDisplay: string | null
}

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ARGENTINA_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const dateLabelFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: ARGENTINA_TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: ARGENTINA_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function parseFifaEasternInstant(date: string, time: string): number {
  return Date.parse(`${date}T${time}:00${FIFA_EASTERN_OFFSET}`)
}

/** Convierte fecha/hora FIFA (Este EE. UU.) a calendario argentino */
export function getArgentinaSchedule(
  match: Pick<Match, 'date' | 'dateLabel' | 'time'>,
): ArgentinaSchedule {
  if (!match.time) {
    return {
      dateKey: match.date,
      dateLabel: match.dateLabel,
      time: null,
      timeDisplay: null,
    }
  }

  const instant = parseFifaEasternInstant(match.date, match.time)
  const dateKey = dateKeyFormatter.format(instant)
  const dateLabel = capitalize(dateLabelFormatter.format(instant))
  const time = timeFormatter
    .format(instant)
    .replace(/\u00a0/g, ' ')
    .trim()

  return {
    dateKey,
    dateLabel,
    time,
    timeDisplay: `${time} hs.`,
  }
}

export function getArgentinaScheduleFromParts(
  date: string,
  timeET: string | null,
  dateLabelFallback: string,
): ArgentinaSchedule {
  return getArgentinaSchedule({
    date,
    time: timeET,
    dateLabel: dateLabelFallback,
  })
}
