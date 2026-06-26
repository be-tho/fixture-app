import { cn } from '../lib/cn'
import type { FormResult } from '../lib/groupForm'

const STYLES: Record<FormResult, string> = {
  V: 'bg-emerald-500/25 text-emerald-200 ring-emerald-400/30',
  E: 'bg-white/10 text-white/55 ring-white/15',
  D: 'bg-rose-500/20 text-rose-200/90 ring-rose-400/25',
}

interface FormBadgesProps {
  form: FormResult[]
  className?: string
}

export function FormBadges({ form, className }: FormBadgesProps) {
  if (form.length === 0) {
    return <span className={cn('text-[9px] text-white/25', className)}>—</span>
  }

  return (
    <div className={cn('flex justify-center gap-0.5', className)}>
      {form.map((r, i) => (
        <span
          key={`${r}-${i}`}
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded text-[8px] font-black ring-1',
            STYLES[r],
          )}
          title={r === 'V' ? 'Victoria' : r === 'E' ? 'Empate' : 'Derrota'}
        >
          {r}
        </span>
      ))}
    </div>
  )
}
