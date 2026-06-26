import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/cn'
import { tw } from '../lib/tw'

export type ToastVariant = 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastStackProps {
  toasts: ToastItem[]
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div
      className="pointer-events-none fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-[200] flex w-full max-w-[480px] -translate-x-1/2 flex-col gap-2 px-4 md:left-auto md:right-6 md:top-6 md:max-w-sm md:translate-x-0 md:px-0"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={cn(
              tw.glassStrong,
              'pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl shadow-black/30',
              toast.variant === 'success' && 'ring-1 ring-mint/30',
              toast.variant === 'error' && 'ring-1 ring-rose-400/30',
            )}
          >
            {toast.variant === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-mint" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            )}
            <p className="text-sm font-medium text-white/90">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
