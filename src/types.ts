export type Stage =
  | 'group'
  | 'round32'
  | 'round16'
  | 'quarter'
  | 'semi'
  | 'third'
  | 'final'

export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

export interface Match {
  id: number
  date: string
  dateLabel: string
  time: string | null
  home: string
  away: string
  group?: GroupLetter
  stage: Stage
  venue: string
}

export interface MatchResult {
  matchId: number
  homeScore: number
  awayScore: number
}

export type ResultsMap = Record<number, MatchResult>

export interface GroupStanding {
  team: string
  group: GroupLetter
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  position: number
}

export interface ResolvedMatch extends Match {
  homeDisplay: string
  awayDisplay: string
  homeScore: number | null
  awayScore: number | null
  hasResult: boolean
}

export const STAGE_LABELS: Record<Stage, string> = {
  group: 'Fase de grupos',
  round32: 'Dieciseisavos',
  round16: 'Octavos',
  quarter: 'Cuartos',
  semi: 'Semifinal',
  third: 'Tercer puesto',
  final: 'Final',
}
