import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppProvider'
import type { ResolvedMatch } from '../types'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'
import { TeamFlag } from './TeamFlag'

interface ScoreModalProps {
  match: ResolvedMatch | null
  onClose: () => void
}

function ScoreStepper({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Menos goles ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={0}
          max={99}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-14 rounded-xl border border-white/15 bg-white/5 py-2 text-center text-2xl font-black text-white outline-none focus:border-mint/50"
        />
        <button
          type="button"
          aria-label={`Más goles ${label}`}
          onClick={() => onChange(Math.min(99, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ScoreModal({ match, onClose }: ScoreModalProps) {
  const { setScore, removeScore, showToast } = useApp()
  const [home, setHome] = useState(0)
  const [away, setAway] = useState(0)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (match) {
      setHome(match.homeScore ?? 0)
      setAway(match.awayScore ?? 0)
      setConfirmDelete(false)
    }
  }, [match])

  if (!match) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await setScore(match.id, home, away)
      showToast('Resultado guardado')
      onClose()
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : 'No se pudo guardar el resultado',
        'error',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setSaving(true)
    try {
      await removeScore(match.id)
      showToast('Resultado borrado')
      onClose()
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : 'No se pudo borrar el resultado',
        'error',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            tw.glassStrong,
            'w-full max-w-[480px] rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
            'md:max-w-md md:rounded-3xl md:pb-5 md:shadow-2xl md:shadow-black/50',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-mint/80">
                Partido #{match.id}
              </p>
              <h2 className="text-sm font-bold text-white">Cargar resultado</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2 text-white/60"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <TeamFlag name={match.homeDisplay} size="lg" />
              <span className="text-xs font-semibold leading-tight text-white/90">
                {match.homeDisplay}
              </span>
            </div>
            <span className="text-lg font-black text-white/30">—</span>
            <div className="flex flex-col items-center gap-2 text-center">
              <TeamFlag name={match.awayDisplay} size="lg" />
              <span className="text-xs font-semibold leading-tight text-white/90">
                {match.awayDisplay}
              </span>
            </div>
          </div>

          <div className="mb-6 flex justify-center gap-8">
            <ScoreStepper value={home} onChange={setHome} label="Local" />
            <ScoreStepper value={away} onChange={setAway} label="Visitante" />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={cn(tw.cta, saving && 'opacity-60')}
          >
            {saving ? 'Guardando…' : 'Guardar resultado'}
          </button>

          {match.hasResult && (
            <div className="mt-3 space-y-2">
              {confirmDelete && (
                <p className="text-center text-[11px] text-rose-200/90">
                  ¿Borrar este resultado? Clic de nuevo para confirmar.
                </p>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={handleClear}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition',
                  confirmDelete
                    ? 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30'
                    : 'text-red-300/80',
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {confirmDelete ? 'Confirmar borrado' : 'Borrar resultado'}
              </button>
              {confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="w-full py-1 text-[11px] text-white/45"
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
