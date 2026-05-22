export function teamInitials(name: string): string {
  const cleaned = name.replace(/^RI de /, '').trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return cleaned.slice(0, 3).toUpperCase()
}
