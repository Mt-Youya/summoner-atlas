import { useTranslation } from "@/components/locale-provider"

export function DataFreshness({ updatedAt, className = "" }: { updatedAt?: string; className?: string }) {
  const translate = useTranslation()
  if (!updatedAt) {
    return <span className={`text-xs text-muted-foreground ${className}`}>{translate("unknownTime")}</span>
  }
  const updated = new Date(updatedAt)
  const now = new Date()
  const hoursAgo = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60))
  const freshness = hoursAgo < 6 ? "fresh" : hoursAgo < 24 ? "recent" : "stale"
  const colorVar = freshness === "fresh" ? "--positive" : freshness === "recent" ? "--warning" : "--muted-foreground"
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs tabular-nums ${className}`}
      style={{ color: `var(${colorVar})` }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: `var(${colorVar})` }}
        aria-hidden="true"
      />
      {translate("updatedAt")}: {updated.toLocaleDateString()}
    </span>
  )
}
