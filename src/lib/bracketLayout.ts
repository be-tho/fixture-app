import type { Stage } from '../types'

export interface BracketRound {
  stage: Stage | 'third_final'
  label: string
  shortLabel: string
  matchIds: number[]
}

/** Orden visual del cuadro eliminatorio (izquierda → derecha) */
export const BRACKET_ROUNDS: BracketRound[] = [
  {
    stage: 'round32',
    label: 'Dieciseisavos de final',
    shortLabel: '16avos',
    matchIds: [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88],
  },
  {
    stage: 'round16',
    label: 'Octavos de final',
    shortLabel: 'Octavos',
    matchIds: [89, 90, 91, 92, 93, 94, 95, 96],
  },
  {
    stage: 'quarter',
    label: 'Cuartos de final',
    shortLabel: 'Cuartos',
    matchIds: [97, 98, 99, 100],
  },
  {
    stage: 'semi',
    label: 'Semifinales',
    shortLabel: 'Semi',
    matchIds: [101, 102],
  },
  {
    stage: 'third_final',
    label: 'Finales',
    shortLabel: 'Final',
    matchIds: [103, 104],
  },
]
