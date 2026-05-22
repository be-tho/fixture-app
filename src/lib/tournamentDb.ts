import { supabase } from './supabase'
import type { GroupLetter, Match, Stage } from '../types'

const GROUPS = 'ABCDEFGHIJKL'.split('') as GroupLetter[]

interface DbTeam {
  name: string
  group_letter: string | null
  country_code: string
}

interface DbMatch {
  id: number
  match_date: string
  date_label: string
  time_et: string | null
  home_label: string
  away_label: string
  group_letter: string | null
  stage: string
  venue: string
}

export interface TournamentData {
  matches: Match[]
  groupTeams: Record<GroupLetter, string[]>
  flagCodes: Record<string, string>
}

export async function fetchTournament(): Promise<TournamentData> {
  if (!supabase) {
    throw new Error(
      'Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env',
    )
  }

  const [teamsRes, matchesRes] = await Promise.all([
    supabase
      .from('teams')
      .select('name, group_letter, country_code')
      .order('name'),
    supabase.from('matches').select('*').order('id'),
  ])

  if (teamsRes.error) throw new Error(teamsRes.error.message)
  if (matchesRes.error) throw new Error(matchesRes.error.message)

  const groupTeams = Object.fromEntries(
    GROUPS.map((g) => [g, [] as string[]]),
  ) as Record<GroupLetter, string[]>

  const flagCodes: Record<string, string> = {}

  for (const t of (teamsRes.data ?? []) as DbTeam[]) {
    flagCodes[t.name] = t.country_code
    if (t.group_letter && GROUPS.includes(t.group_letter as GroupLetter)) {
      groupTeams[t.group_letter as GroupLetter].push(t.name)
    }
  }

  for (const g of GROUPS) {
    groupTeams[g].sort((a, b) => a.localeCompare(b, 'es'))
  }

  const matches: Match[] = ((matchesRes.data ?? []) as DbMatch[]).map((m) => ({
    id: m.id,
    date: m.match_date,
    dateLabel: m.date_label,
    time: m.time_et,
    home: m.home_label,
    away: m.away_label,
    group: m.group_letter as GroupLetter | undefined,
    stage: m.stage as Stage,
    venue: m.venue,
  }))

  return { matches, groupTeams, flagCodes }
}
