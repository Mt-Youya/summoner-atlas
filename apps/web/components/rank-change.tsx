export function RankChange({ delta, className = "" }: { delta?: number; className?: string }) {
  if (delta === undefined || delta === 0) return <span className={`text-xs text-muted-foreground ${className}`}>-</span>
  const isUp = delta > 0
  const colorVar = isUp ? "--positive" : "--negative"
  const arrow = isUp ? "↑" : "↓"
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-xs tabular-nums ${className}`}
      style={{ color: `var(${colorVar})` }}
      aria-label={`${isUp ? "上升" : "下降"} ${Math.abs(delta).toFixed(1)}%`}
    >
      {arrow}
      {Math.abs(delta).toFixed(1)}%
    </span>
  )
}
