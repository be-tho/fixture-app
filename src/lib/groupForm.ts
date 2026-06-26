import type { GroupLetter, Match, ResultsMap } from '../types'

/** V = victoria, E = empate, D = derrota (convención ELNINE / fútbol AR) */
export type FormResult = 'V' | 'E' | 'D'

export function getTeamForm(
  team: string,
  group: GroupLetter,
  matches: Match[],
  results: ResultsMap,
  limit = 3,
): FormResult[] {
  const played = matches
    .filter(
      (m) =>
        m.stage === 'group' &&
        m.group === group &&
        results[m.id] != null &&
        (m.home === team || m.away === team),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id)

  return played.slice(-limit).map((m) => {
    const r = results[m.id]!
    const isHome = m.home === team
    const gf = isHome ? r.homeScore : r.awayScore
    const ga = isHome ? r.awayScore : r.homeScore
    if (gf > ga) return 'V'
    if (gf < ga) return 'D'
    return 'E'
  })
}

export function getGroupForms(
  teams: string[],
  group: GroupLetter,
  matches: Match[],
  results: ResultsMap,
): Record<string, FormResult[]> {
  return Object.fromEntries(
    teams.map((team) => [team, getTeamForm(team, group, matches, results)]),
  )
}
