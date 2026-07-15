"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { TooltipValueType } from "recharts"
import { hextechChartColors } from "./chart-theme"

export function PatchTrendChart({ data }: { data: { patch: string; winRate: number }[] }) {
  if (data.length === 0) return null

  const vals = data.map((d) => d.winRate)
  const min = Math.floor(Math.min(...vals) - 2)
  const max = Math.ceil(Math.max(...vals) + 2)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
        <defs>
          <linearGradient id="trendGradRecharts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={hextechChartColors.muted} vertical={false} />
        <XAxis
          dataKey="patch"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "Outfit, sans-serif" }}
          axisLine={{ stroke: hextechChartColors.muted }}
          tickLine={false}
        />
        <YAxis
          domain={[min, max]}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "Outfit, sans-serif" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "12px",
            fontFamily: "Outfit, sans-serif",
          }}
          formatter={(value: TooltipValueType | undefined) => {
            const winRate = Array.isArray(value) ? value[0] : value
            return [`${Number(winRate ?? 0).toFixed(1)}%`, "Win Rate"] as [string, string]
          }}
        />
        <Area
          type="monotone"
          dataKey="winRate"
          stroke="#00D4FF"
          fill="url(#trendGradRecharts)"
          strokeWidth={2}
          dot={{ fill: "#00D4FF", r: 3, strokeWidth: 0 }}
          activeDot={{ fill: "#00D4FF", r: 5, strokeWidth: 2, stroke: "var(--background)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
