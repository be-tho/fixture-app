import type { GroupLetter, GroupStanding, Match, ResultsMap } from '../types'

const GROUPS = 'ABCDEFGHIJKL'.split('') as GroupLetter[]

function emptyStanding(team: string, group: GroupLetter): GroupStanding {
  return {
    team,
    group,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    position: 0,
  }
}

function compareStandings(a: GroupStanding, b: GroupStanding): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return a.team.localeCompare(b.team, 'es')
}

export function computeGroupStandings(
  matches: Match[],
  groupTeams: Record<GroupLetter, string[]>,
  results: ResultsMap,
  getTeamNames: (match: Match) => { home: string; away: string },
): Record<GroupLetter, GroupStanding[]> {
  const tables = Object.fromEntries(
    GROUPS.map((g) => [
      g,
      groupTeams[g].map((team) => emptyStanding(team, g)),
    ]),
  ) as Record<GroupLetter, GroupStanding[]>

  const groupMatches = matches.filter((m) => m.stage === 'group')

  for (const match of groupMatches) {
    const result = results[match.id]
    if (!result) continue

    const { home, away } = getTeamNames(match)
    const homeRow = tables[match.group!]?.find((r) => r.team === home)
    const awayRow = tables[match.group!]?.find((r) => r.team === away)
    if (!homeRow || !awayRow) continue

    homeRow.played++
    awayRow.played++
    homeRow.goalsFor += result.homeScore
    homeRow.goalsAgainst += result.awayScore
    awayRow.goalsFor += result.awayScore
    awayRow.goalsAgainst += result.homeScore

    if (result.homeScore > result.awayScore) {
      homeRow.won++
      awayRow.lost++
      homeRow.points += 3
    } else if (result.homeScore < result.awayScore) {
      awayRow.won++
      homeRow.lost++
      awayRow.points += 3
    } else {
      homeRow.drawn++
      awayRow.drawn++
      homeRow.points++
      awayRow.points++
    }
  }

  for (const g of GROUPS) {
    tables[g] = tables[g]
      .map((row) => ({
        ...row,
        goalDifference: row.goalsFor - row.goalsAgainst,
      }))
      .sort(compareStandings)
      .map((row, i) => ({ ...row, position: i + 1 }))
  }

  return tables
}

export interface RankedThird {
  team: string
  group: GroupLetter
  points: number
  goalDifference: number
  goalsFor: number
}

export function getRankedThirdPlaces(
  tables: Record<GroupLetter, GroupStanding[]>,
): RankedThird[] {
  const thirds: RankedThird[] = []

  for (const g of GROUPS) {
    const third = tables[g][2]
    if (third && third.played > 0) {
      thirds.push({
        team: third.team,
        group: g,
        points: third.points,
        goalDifference: third.goalDifference,
        goalsFor: third.goalsFor,
      })
    }
  }

  return thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference
    }
    return b.goalsFor - a.goalsFor
  })
}

export function isGroupStageComplete(
  matches: Match[],
  results: ResultsMap,
): boolean {
  return matches
    .filter((m) => m.stage === 'group')
    .every((m) => results[m.id] != null)
}
