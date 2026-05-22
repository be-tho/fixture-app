# Mundial FIFA 2026 — Fixture

App móvil (React + Vite + Tailwind) con fixture completo, grupos, resultados y eliminatorias. Los datos viven en **Supabase**.

## Requisitos

- Node 20+
- Proyecto Supabase con el SQL aplicado

## Configuración

1. Ejecutá `supabase/setup_completo.sql` en el SQL Editor de Supabase.
2. Creá `.env` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
```

3. Instalá y arrancá:

```bash
pnpm install
pnpm dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm db:generate` | Regenera `supabase/setup_completo.sql` desde `scripts/seed-data.ts` |

La app **no** usa JSON local en runtime; solo Supabase (+ `src/constants/tournament.ts` para textos fijos de la UI).
# fixture-app-mundial
# fixture-app
