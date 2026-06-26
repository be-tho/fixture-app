/**
 * Presets de clases Tailwind v4 reutilizables en componentes.
 * Preferir estas constantes + cn() antes que CSS suelto.
 */
export const tw = {
  glass: 'glass',
  glassStrong: 'glass-strong',
  textGradientGold: 'text-gradient-gold',
  scrollbarHide: 'scrollbar-hide',

  /** Contenedor raíz — móvil 480px, desktop full width */
  appShell: 'mx-auto flex min-h-dvh w-full max-w-[480px] flex-col md:max-w-none',

  /** Max width para overlays (nav, modal, toast) */
  overlayMax: 'max-w-[480px] md:max-w-none',

  /** Padding del main content */
  main:
    'px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2 md:px-6 md:pb-6 lg:px-8',

  /** Chip de filtro activo */
  filterActive: 'bg-mint text-slate-900 shadow-md shadow-mint/25',
  filterIdle: 'glass text-white/50 hover:text-white/80',

  /** Botón CTA principal */
  cta:
    'flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mint to-emerald-500 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-mint/20 transition hover:brightness-110 active:scale-[0.98]',
} as const
