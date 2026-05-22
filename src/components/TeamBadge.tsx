import { cn } from '../lib/cn'
import { TeamFlag } from './TeamFlag'

interface TeamBadgeProps {
  name: string
  align?: 'left' | 'right'
  accent?: string
}

export function TeamBadge({ name, align = 'left', accent }: TeamBadgeProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2.5',
        align === 'right' && 'flex-row-reverse text-right',
      )}
    >
      <TeamFlag name={name} size="md" accent={accent} />
      <span className="truncate text-sm font-semibold leading-tight text-white/95">
        {name}
      </span>
    </div>
  )
}
