'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from '@/components/ui/chart'

/* ─── Activity area chart ─────────────────────────────────────── */
const activityConfig = {
  bookings: { label: 'Bookings', color: '#009689' },
  users:    { label: 'Users',    color: '#f97c66' },
}

export function ActivityAreaChart({ data }) {
  return (
    <ChartContainer config={activityConfig} className="h-56 w-full">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#009689" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#009689" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f97c66" stopOpacity={0.20} />
            <stop offset="95%" stopColor="#f97c66" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Area
          type="monotone"
          dataKey="bookings"
          stroke="#009689"
          strokeWidth={2}
          fill="url(#gradBookings)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#f97c66"
          strokeWidth={2}
          fill="url(#gradUsers)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}

/* ─── Booking status donut ────────────────────────────────────── */
const RADIAN = Math.PI / 180

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function BookingStatusChart({ segments, total }) {
  const data = segments.filter(s => s.value > 0)
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={72}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
              strokeWidth={2}
              stroke="#fff"
            >
              {data.map((seg, i) => (
                <Cell key={i} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [v, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-slate-900">{total}</p>
          <p className="text-[10px] text-slate-400 font-medium">Total</p>
        </div>
      </div>

      {/* legend */}
      <div className="w-full space-y-2">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
          return (
            <div key={seg.label} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="flex-1 text-xs text-slate-600 font-medium">{seg.label}</span>
              <span className="text-xs font-bold text-slate-900">{seg.value}</span>
              <span className="w-8 text-right text-xs text-slate-400">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Provider bar chart ──────────────────────────────────────── */
const providerConfig = {
  verified: { label: 'Verified',  color: '#009689' },
  pending:  { label: 'Pending',   color: '#f97c66' },
}

export function ProviderBarChart({ data }) {
  return (
    <ChartContainer config={providerConfig} className="h-44 w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="35%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={58}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="verified" fill="#009689" radius={[0, 4, 4, 0]} />
        <Bar dataKey="pending"  fill="#f97c66" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
