import {
  computeGroupStandings,
  getRankedThirdPlaces,
} from './standings'
import {
  assignThirdPlaces,
  THIRD_PLACE_SLOTS,
} from './thirdPlaces'
import type { GroupLetter, Match, ResolvedMatch, ResultsMap } from '../types'

type Slot =
  | { kind: 'team'; name: string }
  | { kind: 'first'; group: GroupLetter }
  | { kind: 'second'; group: GroupLetter }
  | { kind: 'third'; groups: GroupLetter[] }
  | { kind: 'winner'; matchId: number }
  | { kind: 'loser'; matchId: number }

function parseSlot(name: string): Slot {
  const first = name.match(/^1º Grupo ([A-L])$/i)
  if (first) return { kind: 'first', group: first[1].toUpperCase() as GroupLetter }

  const second = name.match(/^2º Grupo ([A-L])$/i)
  if (second) return { kind: 'second', group: second[1].toUpperCase() as GroupLetter }

  const third = name.match(/^3º\s+(.+)$/i)
  if (third) {
    const groups = third[1]
      .split('/')
      .map((g) => g.trim().toUpperCase() as GroupLetter)
    return { kind: 'third', groups }
  }

  const winner = name.match(/^Ganador P(\d+)$/i)
  if (winner) return { kind: 'winner', matchId: Number(winner[1]) }

  const loser = name.match(/^Perdedor P(\d+)$/i)
  if (loser) return { kind: 'loser', matchId: Number(loser[1]) }

  return { kind: 'team', name }
}

export function resolveTournament(
  matches: Match[],
  groupTeams: Record<GroupLetter, string[]>,
  results: ResultsMap,
): ResolvedMatch[] {
  const thirdByMatch = new Map<number, string>()

  const tables = computeGroupStandings(matches, groupTeams, results, (m) => ({
    home: m.home,
    away: m.away,
  }))
  const rankedThirds = getRankedThirdPlaces(tables)
  const thirdAssignments = assignThirdPlaces(rankedThirds)

  for (const slot of THIRD_PLACE_SLOTS) {
    const team = thirdAssignments.get(slot.matchId)
    if (team) thirdByMatch.set(slot.matchId, team)
  }

  const matchWinner = new Map<number, string>()
  const matchLoser = new Map<number, string>()

  const resolveSlot = (slot: Slot, match: Match, side: 'home' | 'away'): string => {
    switch (slot.kind) {
      case 'team':
        return slot.name
      case 'first': {
        const row = tables[slot.group]?.[0]
        return row?.team ?? `1º Grupo ${slot.group}`
      }
      case 'second': {
        const row = tables[slot.group]?.[1]
        return row?.team ?? `2º Grupo ${slot.group}`
      }
      case 'third':
        return thirdByMatch.get(match.id) ?? match[side]
      case 'winner':
        return matchWinner.get(slot.matchId) ?? `Ganador P${slot.matchId}`
      case 'loser':
        return matchLoser.get(slot.matchId) ?? `Perdedor P${slot.matchId}`
    }
  }

  const resolved: ResolvedMatch[] = []

  for (const match of matches) {
    const homeSlot = parseSlot(match.home)
    const awaySlot = parseSlot(match.away)

    const teams = {
      home: resolveSlot(homeSlot, match, 'home'),
      away: resolveSlot(awaySlot, match, 'away'),
    }
    const result = results[match.id]
    if (result) {
      if (result.homeScore > result.awayScore) {
        matchWinner.set(match.id, teams.home)
        matchLoser.set(match.id, teams.away)
      } else if (result.awayScore > result.homeScore) {
        matchWinner.set(match.id, teams.away)
        matchLoser.set(match.id, teams.home)
      }
    }

    resolved.push({
      ...match,
      homeDisplay: teams.home,
      awayDisplay: teams.away,
      homeScore: result?.homeScore ?? null,
      awayScore: result?.awayScore ?? null,
      hasResult: result != null,
    })
  }

  return resolved
}
