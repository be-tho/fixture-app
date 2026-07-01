/**
 * Actualiza fechas/horarios de eliminatorias (partidos 73–104) en Supabase.
 * Ejecutar: pnpm exec tsx scripts/update-knockout-times.ts
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { MATCHES } from './seed-data.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '../.env')
const env = readFileSync(envPath, 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const key =
  env.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/)?.[1]?.trim() ??
  env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim()

if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env')
  process.exit(1)
}

const supabase = createClient(url, key)
const knockout = MATCHES.filter((m) => m.id >= 73)

const { data: before, error: readErr } = await supabase
  .from('matches')
  .select('id, match_date, time_et')
  .gte('id', 73)
  .order('id')

if (readErr) {
  console.error('Error leyendo:', readErr.message)
  process.exit(1)
}

console.log(`Partidos en DB (73+): ${before?.length ?? 0}`)

let ok = 0
let fail = 0

for (const m of knockout) {
  const { error } = await supabase
    .from('matches')
    .update({
      match_date: m.date,
      date_label: m.dateLabel,
      time_et: m.time,
      home_label: m.home,
      away_label: m.away,
      venue: m.venue,
    })
    .eq('id', m.id)

  if (error) {
    console.error(`#${m.id} ERROR:`, error.message)
    fail++
  } else {
    ok++
  }
}

const { data: after } = await supabase
  .from('matches')
  .select('id, match_date, time_et, stage')
  .gte('id', 73)
  .order('id')

console.log(`\nActualizados: ${ok} | Fallidos: ${fail}`)
console.log('Muestra post-update (73–76):')
console.log(after?.slice(0, 4))

if (fail > 0) process.exit(1)
