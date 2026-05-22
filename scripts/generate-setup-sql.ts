/**
 * Genera supabase/setup_completo.sql con schema + datos del Mundial 2026
 * Ejecutar: pnpm exec tsx scripts/generate-setup-sql.ts
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
/** Solo para regenerar setup_completo.sql — la app usa Supabase en runtime */
import { MATCHES, GROUP_TEAMS, TEAM_FLAG_CODES } from './seed-data.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../supabase/setup_completo.sql')

function esc(s: string) {
  return s.replace(/'/g, "''")
}

const teams = new Map<string, { name: string; flag: string; group: string | null }>()

for (const [group, names] of Object.entries(GROUP_TEAMS)) {
  for (const name of names) {
    const flag = TEAM_FLAG_CODES[name] ?? 'un'
    teams.set(name, { name, flag, group })
  }
}

const teamList = [...teams.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))

let sql = `-- Mundial FIFA 2026 — schema + datos iniciales
-- Ejecutá este archivo en Supabase → SQL Editor → Run

-- ========== SCHEMA ==========
create table if not exists public.countries (
  code text primary key,
  name_es text not null,
  name_en text
);

create table if not exists public.teams (
  id serial primary key,
  country_code text not null references public.countries(code),
  name text unique not null,
  group_letter text check (group_letter between 'A' and 'L')
);

create table if not exists public.matches (
  id integer primary key check (id between 1 and 104),
  match_date date not null,
  date_label text not null,
  time_et text,
  home_label text not null,
  away_label text not null,
  home_team_id integer references public.teams(id),
  away_team_id integer references public.teams(id),
  group_letter text check (group_letter is null or group_letter between 'A' and 'L'),
  stage text not null,
  venue text not null
);

create table if not exists public.match_results (
  match_id integer primary key references public.matches(id) on delete cascade,
  home_score integer not null check (home_score >= 0),
  away_score integer not null check (away_score >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teams_group on public.teams(group_letter);
create index if not exists idx_matches_date on public.matches(match_date);
create index if not exists idx_matches_stage on public.matches(stage);

alter table public.countries enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.match_results enable row level security;

drop policy if exists "countries_select" on public.countries;
create policy "countries_select" on public.countries for select using (true);

drop policy if exists "teams_select" on public.teams;
create policy "teams_select" on public.teams for select using (true);

drop policy if exists "matches_select" on public.matches;
create policy "matches_select" on public.matches for select using (true);

drop policy if exists "Lectura pública de resultados" on public.match_results;
drop policy if exists "Insertar resultados" on public.match_results;
drop policy if exists "Actualizar resultados" on public.match_results;
drop policy if exists "Borrar resultados" on public.match_results;

create policy "results_select" on public.match_results for select using (true);
create policy "results_insert" on public.match_results for insert with check (true);
create policy "results_update" on public.match_results for update using (true);
create policy "results_delete" on public.match_results for delete using (true);

-- ========== DATOS ==========
truncate public.match_results, public.matches, public.teams, public.countries cascade;

`

for (const t of teamList) {
  sql += `insert into public.countries (code, name_es) values ('${esc(t.flag)}', '${esc(t.name)}') on conflict (code) do update set name_es = excluded.name_es;\n`
}

sql += `\n`

for (const t of teamList) {
  const g = t.group ? `'${t.group}'` : 'null'
  sql += `insert into public.teams (country_code, name, group_letter) values ('${esc(t.flag)}', '${esc(t.name)}', ${g}) on conflict (name) do update set country_code = excluded.country_code, group_letter = excluded.group_letter;\n`
}

sql += `\n-- Partidos (104)\n`

for (const m of MATCHES) {
  const homeTeam = teams.has(m.home) ? `(select id from public.teams where name = '${esc(m.home)}')` : 'null'
  const awayTeam = teams.has(m.away) ? `(select id from public.teams where name = '${esc(m.away)}')` : 'null'
  const time = m.time ? `'${m.time}'` : 'null'
  const grp = m.group ? `'${m.group}'` : 'null'
  sql += `insert into public.matches (id, match_date, date_label, time_et, home_label, away_label, home_team_id, away_team_id, group_letter, stage, venue) values (${m.id}, '${m.date}', '${esc(m.dateLabel)}', ${time}, '${esc(m.home)}', '${esc(m.away)}', ${homeTeam}, ${awayTeam}, ${grp}, '${m.stage}', '${esc(m.venue)}') on conflict (id) do update set match_date = excluded.match_date, date_label = excluded.date_label, time_et = excluded.time_et, home_label = excluded.home_label, away_label = excluded.away_label, home_team_id = excluded.home_team_id, away_team_id = excluded.away_team_id, group_letter = excluded.group_letter, stage = excluded.stage, venue = excluded.venue;\n`
}

writeFileSync(outPath, sql, 'utf8')
console.log(`Generado: ${outPath}`)
console.log(`Países/equipos: ${teamList.length} | Partidos: ${MATCHES.length}`)
