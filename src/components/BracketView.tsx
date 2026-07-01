import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { getArgentinaSchedule } from '../lib/argentinaTime'
import {
  BRACKET_ROUND_TABS,
  getFeedsForRound,
  nextRoundLabel,
  QUARTER_FEEDS,
  ROUND16_FEEDS,
  ROUND32_FEEDS,
  SEMI_FEEDS,
  THIRD_PLACE_FROM,
  type BracketFeed,
  type BracketViewRound,
} from '../lib/bracketLayout'
import { formatBracketTeamName } from '../lib/bracketDisplay'
import { cn } from '../lib/cn'
import { isArgentinaMatch } from '../lib/matchSchedule'
import { tw } from '../lib/tw'
import type { ResolvedMatch } from '../types'
import { STAGE_LABELS } from '../types'
import { ScoreModal } from './ScoreModal'
import { TeamFlag } from './TeamFlag'

function BracketMatchCard({
  match,
  onEdit,
  compact = false,
}: {
  match: ResolvedMatch
  onEdit: () => void
  compact?: boolean
}) {
  const schedule = getArgentinaSchedule(match)
  const isFinal = match.stage === 'final'
  const isThird = match.stage === 'third'
  const argentina = isArgentinaMatch(match.homeDisplay, match.awayDisplay)
  const homeWon =
    match.hasResult &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.homeScore > match.awayScore
  const awayWon =
    match.hasResult &&
    match.homeScore != null &&
    match.awayScore != null &&
    match.awayScore > match.homeScore

  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        'group w-full rounded-xl border text-left transition active:scale-[0.99]',
        'border-white/[0.08] bg-white/[0.03] hover:border-mint/25 hover:bg-white/[0.06]',
        match.hasResult && 'border-mint/30 bg-mint/[0.04]',
        isFinal && 'border-amber-400/35 bg-gradient-to-br from-amber-500/10 to-transparent',
        isThird && 'border-white/10',
        argentina && !match.hasResult && 'ring-1 ring-sky-400/25',
        compact ? 'p-2.5' : 'p-3',
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-semibold text-white/35">
          P{match.id}
        </span>
        {(isFinal || isThird) && (
          <span
            className={cn(
              'text-[9px] font-black uppercase tracking-wider',
              isFinal ? 'text-amber-300' : 'text-white/45',
            )}
          >
            {STAGE_LABELS[match.stage]}
          </span>
        )}
        {match.hasResult ? (
          <span className="rounded-full bg-mint/15 px-1.5 py-px text-[8px] font-bold uppercase text-mint">
            FT
          </span>
        ) : schedule.timeDisplay ? (
          <span className="flex items-center gap-0.5 text-[9px] font-semibold tabular-nums text-amber-200/90">
            <Clock className="h-3 w-3" strokeWidth={2.5} />
            {schedule.timeDisplay}
          </span>
        ) : (
          <span className="text-[9px] text-white/30">TBC</span>
        )}
      </div>

      <div className="space-y-1">
        {[{
          name: match.homeDisplay,
          score: match.homeScore,
          won: homeWon,
          isArgentina: /argentina/i.test(match.homeDisplay),
        }, {
          name: match.awayDisplay,
          score: match.awayScore,
          won: awayWon,
          isArgentina: /argentina/i.test(match.awayDisplay),
        }].map((row) => (
          <div
            key={row.name}
            className={cn(
              'flex items-center gap-2 rounded-lg px-1.5 py-1',
              row.won && 'bg-mint/10',
              row.isArgentina && !row.won && 'bg-sky-500/[0.06]',
            )}
          >
            <TeamFlag name={row.name} size="sm" />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-[11px]',
                row.won ? 'font-bold text-white' : 'font-medium text-white/85',
              )}
              title={row.name}
            >
              {formatBracketTeamName(row.name)}
            </span>
            {match.hasResult && row.score != null && (
              <span
                className={cn(
                  'min-w-[1rem] text-right text-sm font-black tabular-nums',
                  row.won ? 'text-mint' : 'text-white/40',
                )}
              >
                {row.score}
              </span>
            )}
          </div>
        ))}
      </div>

      {!compact && (
        <p className="mt-2 flex items-center gap-1 truncate text-[9px] text-white/35">
          <MapPin className="h-2.5 w-2.5 shrink-0 text-mint/60" />
          {match.venue.replace(/^Estadio /, '')}
        </p>
      )}
    </button>
  )
}

function FeedGroup({
  feed,
  byId,
  onEdit,
  showConnector = true,
}: {
  feed: BracketFeed
  byId: Map<number, ResolvedMatch>
  onEdit: (m: ResolvedMatch) => void
  showConnector?: boolean
}) {
  const [topId, bottomId] = feed.matchIds
  const next = byId.get(feed.nextMatchId)
  const top = byId.get(topId)
  const bottom = byId.get(bottomId)
  if (!top || !bottom || !next) return null

  const destLabel = nextRoundLabel(feed.nextMatchId)

  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-3">
      <div className="space-y-2">
        <BracketMatchCard match={top} onEdit={() => onEdit(top)} compact />
        <BracketMatchCard match={bottom} onEdit={() => onEdit(bottom)} compact />
      </div>

      {showConnector && (
        <div className="hidden flex-col items-center gap-1 lg:flex">
          <div className="h-px w-6 bg-gradient-to-r from-transparent via-white/20 to-white/20" />
          <ArrowRight className="h-4 w-4 text-mint/50" />
          <span className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-wide text-white/35">
            {destLabel}
          </span>
        </div>
      )}

      <div className="relative">
        {!showConnector && (
          <p className="mb-1.5 flex items-center gap-1 text-[9px] font-semibold text-mint/70">
            <ChevronRight className="h-3 w-3" />
            Clasifican a P{feed.nextMatchId}
          </p>
        )}
        <BracketMatchCard
          match={next}
          onEdit={() => onEdit(next)}
          compact={showConnector}
        />
      </div>
    </div>
  )
}

function FullBracketTree({
  byId,
  onEdit,
}: {
  byId: Map<number, ResolvedMatch>
  onEdit: (m: ResolvedMatch) => void
}) {
  const final = byId.get(104)
  const third = byId.get(103)

  return (
    <div className="space-y-8">
      <section>
        <RoundHeader
          title="Dieciseisavos → Octavos"
          subtitle="8 llaves · el ganador de cada par avanza"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {ROUND32_FEEDS.map((feed) => (
            <div
              key={feed.nextMatchId}
              className={cn(tw.glass, 'rounded-2xl p-3 lg:p-4')}
            >
              <FeedGroup feed={feed} byId={byId} onEdit={onEdit} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <RoundHeader title="Octavos → Cuartos" subtitle="4 llaves" />
        <div className="grid gap-4 lg:grid-cols-2">
          {ROUND16_FEEDS.map((feed) => (
            <div key={feed.nextMatchId} className={cn(tw.glass, 'rounded-2xl p-3 lg:p-4')}>
              <FeedGroup feed={feed} byId={byId} onEdit={onEdit} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <RoundHeader title="Cuartos → Semifinal" subtitle="2 llaves" />
        <div className="grid gap-4 lg:grid-cols-2">
          {QUARTER_FEEDS.map((feed) => (
            <div key={feed.nextMatchId} className={cn(tw.glass, 'rounded-2xl p-3 lg:p-4')}>
              <FeedGroup feed={feed} byId={byId} onEdit={onEdit} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <RoundHeader title="Semifinal → Final" subtitle="Los perdedores juegan el 3er puesto" />
        <div className="grid gap-4 lg:grid-cols-2">
          {SEMI_FEEDS.map((feed) => (
            <div key={feed.nextMatchId} className={cn(tw.glass, 'rounded-2xl p-3 lg:p-4')}>
              <FeedGroup feed={feed} byId={byId} onEdit={onEdit} />
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {third && (
            <div className={cn(tw.glass, 'rounded-2xl p-4')}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Tercer puesto · P103
              </p>
              <BracketMatchCard match={third} onEdit={() => onEdit(third)} />
            </div>
          )}
          {final && (
            <div
              className={cn(
                tw.glass,
                'rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-transparent to-mint/5 p-4',
              )}
            >
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                <Trophy className="h-3.5 w-3.5" />
                Final · P104
              </p>
              <BracketMatchCard match={final} onEdit={() => onEdit(final)} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function RoundHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-[10px] text-white/40">{subtitle}</p>
    </div>
  )
}

function SingleRoundView({
  round,
  byId,
  onEdit,
}: {
  round: BracketViewRound
  byId: Map<number, ResolvedMatch>
  onEdit: (m: ResolvedMatch) => void
}) {
  if (round === 'third_final') {
    const third = byId.get(103)
    const final = byId.get(104)
    return (
      <div className="space-y-3">
        {third && (
          <div className={cn(tw.glass, 'rounded-2xl p-4')}>
            <RoundHeader title="Tercer puesto" subtitle="Perdedores de semifinal" />
            <BracketMatchCard match={third} onEdit={() => onEdit(third)} />
          </div>
        )}
        {final && (
          <div
            className={cn(
              tw.glass,
              'rounded-2xl border border-amber-400/20 p-4',
            )}
          >
            <RoundHeader title="Final" subtitle="Campeón del Mundial 2026" />
            <BracketMatchCard match={final} onEdit={() => onEdit(final)} />
          </div>
        )}
      </div>
    )
  }

  const feeds = getFeedsForRound(round)

  if (feeds.length === 0) return null

  return (
    <div className="space-y-3">
      {feeds.map((feed) => (
        <div key={feed.nextMatchId} className={cn(tw.glass, 'rounded-2xl p-3 md:p-4')}>
          <FeedGroup feed={feed} byId={byId} onEdit={onEdit} showConnector={false} />
        </div>
      ))}

      {round === 'semi' && byId.get(103) && (
        <div className={cn(tw.glass, 'rounded-2xl p-3 md:p-4')}>
          <p className="mb-2 text-[10px] font-semibold text-white/45">
            Perdedores de P{THIRD_PLACE_FROM.matchIds[0]} y P{THIRD_PLACE_FROM.matchIds[1]} → P103
          </p>
          <BracketMatchCard
            match={byId.get(103)!}
            onEdit={() => onEdit(byId.get(103)!)}
          />
        </div>
      )}
    </div>
  )
}

export function BracketView() {
  const { resolvedMatches, groupComplete } = useApp()
  const [editing, setEditing] = useState<ResolvedMatch | null>(null)
  const [activeRound, setActiveRound] = useState<BracketViewRound>('all')

  const byId = useMemo(
    () => new Map(resolvedMatches.map((m) => [m.id, m])),
    [resolvedMatches],
  )

  return (
    <div className="space-y-4">
      {!groupComplete && (
        <p className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2.5 text-center text-[11px] leading-relaxed text-amber-100/90">
          Completá los resultados de grupos para ver equipos reales en lugar de placeholders.
        </p>
      )}

      <div
        className={cn(
          tw.scrollbarHide,
          'flex gap-2 overflow-x-auto pb-1',
        )}
        role="tablist"
        aria-label="Ronda del cuadro"
      >
        {BRACKET_ROUND_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeRound === tab.id}
            onClick={() => setActiveRound(tab.id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition',
              activeRound === tab.id ? tw.filterActive : tw.filterIdle,
            )}
          >
            {tab.shortLabel}
          </button>
        ))}
      </div>

      <p className="text-[10px] leading-relaxed text-white/35">
        Cada llave muestra dos partidos y el cruce siguiente. Tocá cualquier partido para cargar el resultado.
      </p>

      <motion.div
        key={activeRound}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeRound === 'all' ? (
          <FullBracketTree byId={byId} onEdit={setEditing} />
        ) : (
          <SingleRoundView round={activeRound} byId={byId} onEdit={setEditing} />
        )}
      </motion.div>

      <ScoreModal match={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
