export function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function number(value: number) {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

export function MetricValue({
  value,
  type = "percent",
  className = "",
}: {
  value: number | undefined
  type?: "percent" | "number" | "raw"
  className?: string
}) {
  if (value == null) return <span className={`font-mono tabular-nums ${className}`}>—</span>
  const formatted = type === "percent" ? percent(value) : type === "number" ? number(value) : String(value)
  return <span className={`font-mono tabular-nums ${className}`}>{formatted}</span>
}
