export const tokens = {
  color: {
    background: "var(--background)",
    surface: "var(--surface)",
    surfaceRaised: "var(--surface-raised)",
    foreground: "var(--foreground)",
    mutedForeground: "var(--muted-foreground)",
    border: "var(--border)",
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    positive: "var(--positive)",
    negative: "var(--negative)",
    warning: "var(--warning)",
    warningForeground: "var(--warning-foreground)",
  },
  tier: {
    s: "var(--tier-s)",
    a: "var(--tier-a)",
    b: "var(--tier-b)",
    c: "var(--tier-c)",
    d: "var(--tier-d)",
  },
  augment: {
    prismatic: "var(--augment-prismatic)",
    gold: "var(--augment-gold)",
    silver: "var(--augment-silver)",
  },
  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
} as const
