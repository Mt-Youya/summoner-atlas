import { Badge } from "@summoner-atlas/ui/badge"

export function TierMark({ tier, size = "md" }: { tier: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "text-[10px] h-4 px-1.5" : size === "lg" ? "text-sm h-6 px-2" : "text-xs h-5 px-1.5"

  return (
    <span aria-label={`Tier ${tier}`}>
      <Badge
        variant="outline"
        className={`font-mono font-bold tabular-nums ${sizeClass}`}
        style={{
          color: `var(--tier-${tier.toLowerCase()})`,
          backgroundColor: `color-mix(in oklch, var(--tier-${tier.toLowerCase()}) 15%, transparent)`,
          borderColor: `var(--tier-${tier.toLowerCase()})`,
        }}
      >
        {tier}
      </Badge>
    </span>
  )
}
