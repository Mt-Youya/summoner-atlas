import { useTranslation } from "@/components/locale-provider"

export function SampleConfidence({ matches, className = "" }: { matches: number; className?: string }) {
  const translate = useTranslation()
  const level = matches >= 5000 ? "high" : matches >= 1000 ? "medium" : "low"
  const colorVar = level === "high" ? "--positive" : level === "medium" ? "--warning" : "--muted-foreground"
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
      {translate(level)}
    </span>
  )
}
