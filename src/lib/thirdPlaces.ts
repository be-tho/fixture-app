import type { GroupLetter, GroupStanding, Match, ResultsMap } from '../types'
import { getRankedThirdPlaces } from './standings'

export const THIRD_PLACE_SLOTS: { matchId: number; groups: GroupLetter[] }[] = [
  { matchId: 74, groups: ['A', 'B', 'C', 'D', 'F'] },
  { matchId: 77, groups: ['C', 'D', 'F', 'G', 'H'] },
  { matchId: 79, groups: ['C', 'E', 'F', 'H', 'I'] },
  { matchId: 80, groups: ['E', 'H', 'I', 'J', 'K'] },
  { matchId: 81, groups: ['B', 'E', 'F', 'I', 'J'] },
  { matchId: 82, groups: ['A', 'E', 'H', 'I', 'J'] },
  { matchId: 85, groups: ['E', 'F', 'G', 'I', 'J'] },
  { matchId: 87, groups: ['D', 'E', 'I', 'J', 'L'] },
]

const GROUPS = 'ABCDEFGHIJKL'.split('') as GroupLetter[]

export interface RankedThird {
  team: string
  group: GroupLetter
  points: number
  goalDifference: number
  goalsFor: number
}

export function assignThirdPlaces(
  ranked: RankedThird[],
): Map<number, string> {
  const assignedGroups = new Set<GroupLetter>()
  const byMatch = new Map<number, string>()

  for (const { matchId, groups } of THIRD_PLACE_SLOTS) {
    const pick = ranked.find(
      (t) => groups.includes(t.group) && !assignedGroups.has(t.group),
    )
    if (pick) {
      assignedGroups.add(pick.group)
      byMatch.set(matchId, pick.team)
    }
  }

  return byMatch
}

export interface ThirdPlaceCandidate extends GroupStanding {
  thirdRank: number
  qualifies: boolean
  assignedMatchId: number | null
  eligibleSlots: number[]
  remainingMatches: number
  maxPoints: number
}

export interface ThirdPlaceSlotAssignment {
  matchId: number
  groups: GroupLetter[]
  team: string | null
  group: GroupLetter | null
}

function compareStandings(a: GroupStanding, b: GroupStanding): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return a.team.localeCompare(b.team, 'es')
}

function countRemainingGroupMatches(
  team: string,
  group: GroupLetter,
  matches: Match[],
  results: ResultsMap,
): number {
  return matches.filter(
    (m) =>
      m.stage === 'group' &&
      m.group === group &&
      !results[m.id] &&
      (m.home === team || m.away === team),
  ).length
}

export function computeThirdPlaceRace(
  tables: Record<GroupLetter, GroupStanding[]>,
  matches: Match[],
  results: ResultsMap,
): { candidates: ThirdPlaceCandidate[]; slots: ThirdPlaceSlotAssignment[] } {
  const rankedForAssignment = getRankedThirdPlaces(tables)
  const assignments = assignThirdPlaces(rankedForAssignment)

  const candidates: ThirdPlaceCandidate[] = GROUPS.map((g) => {
    const third = tables[g][2]
    if (!third) {
      throw new Error(`Grupo ${g} sin tabla`)
    }

    const remaining = countRemainingGroupMatches(third.team, g, matches, results)
    const eligibleSlots = THIRD_PLACE_SLOTS
      .filter((s) => s.groups.includes(g))
      .map((s) => s.matchId)

    return {
      ...third,
      thirdRank: 0,
      qualifies: false,
      assignedMatchId: null,
      eligibleSlots,
      remainingMatches: remaining,
      maxPoints: third.points + remaining * 3,
    }
  })

  candidates.sort(compareStandings)

  candidates.forEach((c, i) => {
    c.thirdRank = i + 1
    c.qualifies = i < 8
  })

  for (const c of candidates) {
    for (const [matchId, team] of assignments) {
      if (team === c.team) {
        c.assignedMatchId = matchId
        break
      }
    }
  }

  const slots: ThirdPlaceSlotAssignment[] = THIRD_PLACE_SLOTS.map((slot) => {
    const team = assignments.get(slot.matchId) ?? null
    const group = team
      ? (candidates.find((c) => c.team === team)?.group ?? null)
      : null
    return { matchId: slot.matchId, groups: slot.groups, team, group }
  })

  return { candidates, slots }
}
