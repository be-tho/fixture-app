import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ToastStack, type ToastItem, type ToastVariant } from '../components/Toast'
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
import {
  computeThirdPlaceRace,
  type ThirdPlaceCandidate,
  type ThirdPlaceSlotAssignment,
} from '../lib/thirdPlaces'
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
  thirdPlaceCandidates: ThirdPlaceCandidate[]
  thirdPlaceSlots: ThirdPlaceSlotAssignment[]
  setScore: (matchId: number, homeScore: number, awayScore: number) => Promise<void>
  removeScore: (matchId: number) => Promise<void>
  getStandings: (group: GroupLetter) => GroupStanding[]
  refresh: (options?: { silent?: boolean }) => Promise<void>
  showToast: (message: string, variant?: ToastVariant) => void
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
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = ++toastId.current
      setToasts((prev) => [...prev, { id, message, variant }])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3200)
    },
    [],
  )

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true)
    }
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
      if (options?.silent) {
        showToast('Fixture actualizado')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al cargar datos'
      if (options?.silent) {
        showToast(message, 'error')
      } else {
        setError(message)
      }
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [showToast])

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

  const thirdPlaceRace = useMemo(
    () =>
      matches.length > 0
        ? computeThirdPlaceRace(standings, matches, results)
        : { candidates: [], slots: [] },
    [standings, matches, results],
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
      thirdPlaceCandidates: thirdPlaceRace.candidates,
      thirdPlaceSlots: thirdPlaceRace.slots,
      setScore,
      removeScore,
      getStandings: (group) => standings[group] ?? [],
      refresh,
      showToast,
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
      thirdPlaceRace,
      setScore,
      removeScore,
      refresh,
      showToast,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} />
    </AppContext.Provider>
  )
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
