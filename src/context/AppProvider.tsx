import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { resolveTournament } from '../lib/bracket'
import {
  clearResult,
  loadResults,
  saveResult,
} from '../lib/resultsStorage'
import {
  computeGroupStandings,
  isGroupStageComplete,
} from '../lib/standings'
import { fetchTournament } from '../lib/tournamentDb'
import type {
  GroupLetter,
  GroupStanding,
  Match,
  MatchResult,
  ResolvedMatch,
  ResultsMap,
} from '../types'

interface AppContextValue {
  matches: Match[]
  groupTeams: Record<GroupLetter, string[]>
  flagCodes: Record<string, string>
  results: ResultsMap
  resolvedMatches: ResolvedMatch[]
  loading: boolean
  error: string | null
  groupComplete: boolean
  setScore: (matchId: number, homeScore: number, awayScore: number) => Promise<void>
  removeScore: (matchId: number) => Promise<void>
  getStandings: (group: GroupLetter) => GroupStanding[]
  refresh: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [groupTeams, setGroupTeams] = useState<
    Record<GroupLetter, string[]>
  >({} as Record<GroupLetter, string[]>)
  const [flagCodes, setFlagCodes] = useState<Record<string, string>>({})
  const [results, setResults] = useState<ResultsMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [tournament, loadedResults] = await Promise.all([
        fetchTournament(),
        loadResults(),
      ])
      setMatches(tournament.matches)
      setGroupTeams(tournament.groupTeams)
      setFlagCodes(tournament.flagCodes)
      setResults(loadedResults)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const resolvedMatches = useMemo(
    () =>
      matches.length > 0
        ? resolveTournament(matches, groupTeams, results)
        : [],
    [matches, groupTeams, results],
  )

  const standings = useMemo(
    () =>
      matches.length > 0
        ? computeGroupStandings(matches, groupTeams, results, (m) => ({
            home: m.home,
            away: m.away,
          }))
        : ({} as Record<GroupLetter, GroupStanding[]>),
    [matches, groupTeams, results],
  )

  const setScore = useCallback(
    async (matchId: number, homeScore: number, awayScore: number) => {
      const entry: MatchResult = { matchId, homeScore, awayScore }
      await saveResult(entry)
      setResults((prev) => ({ ...prev, [matchId]: entry }))
    },
    [],
  )

  const removeScore = useCallback(async (matchId: number) => {
    await clearResult(matchId)
    setResults((prev) => {
      const next = { ...prev }
      delete next[matchId]
      return next
    })
  }, [])

  const value = useMemo(
    (): AppContextValue => ({
      matches,
      groupTeams,
      flagCodes,
      results,
      resolvedMatches,
      loading,
      error,
      groupComplete: isGroupStageComplete(matches, results),
      setScore,
      removeScore,
      getStandings: (group) => standings[group] ?? [],
      refresh,
    }),
    [
      matches,
      groupTeams,
      flagCodes,
      results,
      resolvedMatches,
      loading,
      error,
      standings,
      setScore,
      removeScore,
      refresh,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de AppProvider')
  }
  return ctx
}

/** Alias para componentes que solo usan resultados */
export const useResults = useApp
