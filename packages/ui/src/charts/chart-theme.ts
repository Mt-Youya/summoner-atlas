export const hextechChartColors = {
  primary: "#00D4FF",
  purple: "#7B2FBE",
  amber: "#F0C060",
  destructive: "#EF4444",
  success: "#10B981",
  muted: "rgba(0,212,255,0.08)",
}

export const hextechChartDefaults = {
  grid: {
    stroke: "rgba(0,212,255,0.06)",
    strokeDasharray: "4 4",
  },
  axis: {
    tick: { fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "Outfit, sans-serif" },
    line: { stroke: "rgba(0,212,255,0.1)" },
  },
  tooltip: {
    contentStyle: {
      background: "var(--popover)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      fontSize: "12px",
      fontFamily: "Outfit, sans-serif",
    },
  },
}
