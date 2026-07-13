export type Rankable = { name: string; matches: number; winRate: number; alias?: string }

export function filterRankings<T extends Rankable>(
  entries: T[],
  query: string,
  sort: "winRate" | "matches",
  minimumMatches: number
) {
  const normalizedQuery = query.trim().toLowerCase()
  return entries
    .filter((entry) => entry.matches >= minimumMatches)
    .filter(
      (entry) =>
        !normalizedQuery ||
        entry.name.toLowerCase().includes(normalizedQuery) ||
        entry.alias?.toLowerCase().includes(normalizedQuery)
    )
    .toSorted((a, b) => (sort === "matches" ? b.matches - a.matches : b.winRate - a.winRate))
}
