export function getTeamFlagCode(
  name: string,
  flagCodes: Record<string, string>,
): string | null {
  return flagCodes[name] ?? null
}

export function isKnownTeam(
  name: string,
  flagCodes: Record<string, string>,
): boolean {
  return name in flagCodes
}

export function getFlagUrl(code: string, width = 80): string {
  return `https://flagcdn.com/w${width}/${code}.png`
}

export function extractGroupLetter(name: string): string | null {
  const m = name.match(/Grupo\s+([A-L])/i)
  return m ? m[1].toUpperCase() : null
}

export function isPlaceholderTeam(
  name: string,
  flagCodes: Record<string, string>,
): boolean {
  return !isKnownTeam(name, flagCodes)
}
