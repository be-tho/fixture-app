import type { GroupLetter } from '../types'

export const GROUP_GRADIENT: Record<GroupLetter, string> = {
  A: 'from-rose-500 to-orange-600',
  B: 'from-sky-400 to-blue-600',
  C: 'from-amber-400 to-yellow-600',
  D: 'from-blue-500 to-indigo-600',
  E: 'from-violet-500 to-purple-700',
  F: 'from-orange-400 to-red-500',
  G: 'from-cyan-400 to-teal-600',
  H: 'from-pink-500 to-fuchsia-600',
  I: 'from-indigo-400 to-violet-600',
  J: 'from-lime-400 to-emerald-600',
  K: 'from-emerald-400 to-green-700',
  L: 'from-red-500 to-rose-700',
}

export const GROUP_RING: Record<GroupLetter, string> = {
  A: 'ring-rose-500/40',
  B: 'ring-sky-500/40',
  C: 'ring-amber-500/40',
  D: 'ring-blue-500/40',
  E: 'ring-violet-500/40',
  F: 'ring-orange-500/40',
  G: 'ring-cyan-500/40',
  H: 'ring-pink-500/40',
  I: 'ring-indigo-500/40',
  J: 'ring-lime-500/40',
  K: 'ring-emerald-500/40',
  L: 'ring-red-500/40',
}

export const STAGE_STYLES = {
  group: 'bg-white/10 text-white/80',
  round32: 'bg-violet-500/20 text-violet-200',
  round16: 'bg-blue-500/20 text-blue-200',
  quarter: 'bg-amber-500/20 text-amber-200',
  semi: 'bg-orange-500/20 text-orange-200',
  third: 'bg-slate-500/20 text-slate-300',
  final: 'bg-gradient-to-r from-amber-400/30 to-yellow-300/30 text-amber-100 border border-amber-400/30',
} as const
