"use client"

import { AreaChart, Area, ResponsiveContainer } from "recharts"

export function MiniSparkline({ data }: { data: { patch: string; winRate: number }[] }) {
  if (data.length === 0) return null

  return (
    <ResponsiveContainer width={120} height={36}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="sparkGradRecharts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="winRate"
          stroke="#00D4FF"
          fill="url(#sparkGradRecharts)"
          strokeWidth={1.5}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
