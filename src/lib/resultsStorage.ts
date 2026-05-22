import type { MatchResult, ResultsMap } from '../types'
import { supabase } from './supabase'

function rowToResult(row: {
  match_id: number
  home_score: number
  away_score: number
}): MatchResult {
  return {
    matchId: row.match_id,
    homeScore: row.home_score,
    awayScore: row.away_score,
  }
}

export async function loadResults(): Promise<ResultsMap> {
  if (!supabase) throw new Error('Supabase no configurado')

  const { data, error } = await supabase
    .from('match_results')
    .select('match_id, home_score, away_score')

  if (error) throw error

  const map: ResultsMap = {}
  for (const row of data ?? []) {
    map[row.match_id] = rowToResult(row)
  }
  return map
}

export async function saveResult(result: MatchResult): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')

  const { error } = await supabase.from('match_results').upsert(
    {
      match_id: result.matchId,
      home_score: result.homeScore,
      away_score: result.awayScore,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'match_id' },
  )
  if (error) throw error
}

export async function clearResult(matchId: number): Promise<void> {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase
    .from('match_results')
    .delete()
    .eq('match_id', matchId)
  if (error) throw error
}
