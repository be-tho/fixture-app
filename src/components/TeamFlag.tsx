import { HelpCircle, Swords } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import {
  extractGroupLetter,
  getFlagUrl,
  getTeamFlagCode,
  isPlaceholderTeam,
} from '../lib/flags'
import { cn } from '../lib/cn'
import { teamInitials } from '../lib/teamInitials'

const SIZE_MAP = {
  sm: { box: 'h-8 w-8', width: 40, text: 'text-[9px]' },
  md: { box: 'h-10 w-10', width: 80, text: 'text-[10px]' },
  lg: { box: 'h-14 w-14', width: 120, text: 'text-xs' },
} as const

type TeamFlagSize = keyof typeof SIZE_MAP

interface TeamFlagProps {
  name: string
  size?: TeamFlagSize
  className?: string
  accent?: string
}

export function TeamFlag({
  name,
  size = 'md',
  className,
  accent,
}: TeamFlagProps) {
  const { flagCodes } = useApp()
  const [failed, setFailed] = useState(false)
  const code = getTeamFlagCode(name, flagCodes)
  const { box, width, text } = SIZE_MAP[size]

  if (code && !failed) {
    return (
      <span
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/15 shadow-md',
          box,
          className,
        )}
      >
        <img
          src={getFlagUrl(code, width)}
          srcSet={`${getFlagUrl(code, width * 2)} 2x`}
          alt=""
          width={width}
          height={Math.round(width * 0.75)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }

  if (isPlaceholderTeam(name, flagCodes)) {
    const groupLetter = extractGroupLetter(name)
    if (groupLetter) {
      return (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-white/10 font-black text-white/70 ring-2 ring-white/15',
            box,
            text,
            className,
          )}
          aria-hidden
        >
          {groupLetter}
        </span>
      )
    }

    const isWinnerLoser = /Ganador|Perdedor/i.test(name)
    return (
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-white/8 text-white/45 ring-2 ring-white/10',
          box,
          className,
        )}
        aria-hidden
      >
        {isWinnerLoser ? (
          <Swords className="h-4 w-4" strokeWidth={2} />
        ) : (
          <HelpCircle className="h-4 w-4" strokeWidth={2} />
        )}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold tracking-wide text-white shadow-md ring-2 ring-white/15',
        box,
        text,
        accent ?? 'bg-gradient-to-br from-slate-600 to-slate-800',
        className,
      )}
      aria-hidden
    >
      {teamInitials(name)}
    </span>
  )
}
