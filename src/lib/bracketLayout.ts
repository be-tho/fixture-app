import type { Stage } from '../types'

export interface BracketRound {
  stage: Stage | 'third_final'
  label: string
  shortLabel: string
  matchIds: number[]
}

/** Llave: dos partidos de la ronda anterior alimentan el siguiente */
export interface BracketFeed {
  nextMatchId: number
  matchIds: [number, number]
}

/** Árbol oficial FIFA — orden visual para el cuadro eliminatorio */
export const ROUND32_FEEDS: BracketFeed[] = [
  { nextMatchId: 90, matchIds: [73, 75] },
  { nextMatchId: 89, matchIds: [74, 77] },
  { nextMatchId: 91, matchIds: [76, 78] },
  { nextMatchId: 92, matchIds: [79, 80] },
  { nextMatchId: 93, matchIds: [83, 84] },
  { nextMatchId: 94, matchIds: [81, 82] },
  { nextMatchId: 95, matchIds: [86, 88] },
  { nextMatchId: 96, matchIds: [85, 87] },
]

export const ROUND16_FEEDS: BracketFeed[] = [
  { nextMatchId: 97, matchIds: [89, 90] },
  { nextMatchId: 98, matchIds: [93, 94] },
  { nextMatchId: 99, matchIds: [91, 92] },
  { nextMatchId: 100, matchIds: [95, 96] },
]

export const QUARTER_FEEDS: BracketFeed[] = [
  { nextMatchId: 101, matchIds: [97, 98] },
  { nextMatchId: 102, matchIds: [99, 100] },
]

export const SEMI_FEEDS: BracketFeed[] = [
  { nextMatchId: 104, matchIds: [101, 102] },
]

export const THIRD_PLACE_FROM = { matchIds: [101, 102] as [number, number], nextMatchId: 103 }

export type BracketViewRound = Stage | 'third_final' | 'all'

export interface BracketRoundTab {
  id: BracketViewRound
  label: string
  shortLabel: string
}

export const BRACKET_ROUND_TABS: BracketRoundTab[] = [
  { id: 'all', label: 'Cuadro completo', shortLabel: 'Todo' },
  { id: 'round32', label: 'Dieciseisavos de final', shortLabel: '16avos' },
  { id: 'round16', label: 'Octavos de final', shortLabel: 'Octavos' },
  { id: 'quarter', label: 'Cuartos de final', shortLabel: 'Cuartos' },
  { id: 'semi', label: 'Semifinales', shortLabel: 'Semi' },
  { id: 'third_final', label: 'Finales', shortLabel: 'Final' },
]

/** Etiqueta de la ronda destino para mostrar en tarjetas */
export function nextRoundLabel(nextMatchId: number): string {
  if (nextMatchId === 103) return '3er puesto'
  if (nextMatchId === 104) return 'Final'
  if (nextMatchId >= 97 && nextMatchId <= 100) return 'Cuartos'
  if (nextMatchId >= 89 && nextMatchId <= 96) return 'Octavos'
  return 'Siguiente ronda'
}

/** Orden visual del cuadro eliminatorio (izquierda → derecha) */
export const BRACKET_ROUNDS: BracketRound[] = [
  {
    stage: 'round32',
    label: 'Dieciseisavos de final',
    shortLabel: '16avos',
    matchIds: ROUND32_FEEDS.flatMap((f) => f.matchIds),
  },
  {
    stage: 'round16',
    label: 'Octavos de final',
    shortLabel: 'Octavos',
    matchIds: ROUND16_FEEDS.flatMap((f) => f.matchIds),
  },
  {
    stage: 'quarter',
    label: 'Cuartos de final',
    shortLabel: 'Cuartos',
    matchIds: QUARTER_FEEDS.flatMap((f) => f.matchIds),
  },
  {
    stage: 'semi',
    label: 'Semifinales',
    shortLabel: 'Semi',
    matchIds: SEMI_FEEDS.flatMap((f) => f.matchIds),
  },
  {
    stage: 'third_final',
    label: 'Finales',
    shortLabel: 'Final',
    matchIds: [103, 104],
  },
]

export function getFeedsForRound(round: BracketViewRound): BracketFeed[] {
  switch (round) {
    case 'round32':
      return ROUND32_FEEDS
    case 'round16':
      return ROUND16_FEEDS
    case 'quarter':
      return QUARTER_FEEDS
    case 'semi':
      return SEMI_FEEDS
    case 'third_final':
      return [{ nextMatchId: 104, matchIds: [101, 102] }]
    default:
      return []
  }
}
