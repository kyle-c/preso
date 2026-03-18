'use client'

import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ComposedChart,
  PieChart, Pie, Cell, Legend,
  ScatterChart, Scatter, ZAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { ChartSpec } from './slide-renderer'

// Ordered for maximum hue separation between adjacent series on dark backgrounds
const DARK_BG_COLORS = [
  '#2BF2F1', // turquoise
  '#F19D38', // mango
  '#60D06F', // cactus
  '#F26629', // papaya
  '#DCFF00', // lime
  '#FFCD9C', // lychee
  '#6060BF', // blueberry
  '#7BA882', // sage
  '#8DFDFA', // sky
  '#877867', // mocha
]

// Ordered for contrast on light backgrounds — darker/more saturated colors first
const LIGHT_BG_COLORS = [
  '#6060BF', // blueberry
  '#F26629', // papaya
  '#082422', // slate
  '#35605F', // evergreen
  '#877867', // mocha
  '#7BA882', // sage
  '#F19D38', // mango
  '#60D06F', // cactus
  '#2BF2F1', // turquoise
  '#DCFF00', // lime
]

function getColors(spec: ChartSpec, dark: boolean): string[] {
  if (spec.colors?.length) return spec.colors
  return dark ? DARK_BG_COLORS : LIGHT_BG_COLORS
}

function axisStyle(dark: boolean) {
  return { fontSize: 11, fill: dark ? '#2BF2F1' : '#35605F', opacity: 0.7 }
}
const GRID_STYLE = { strokeDasharray: '3 3', stroke: 'currentColor', opacity: 0.1 }

/* ─── Custom (non-Recharts) chart types ─── */

const CUSTOM_CHART_TYPES = new Set(['waterfall', 'funnel', 'gauge', 'heatmap', 'treemap', 'candlestick', 'pictorial', 'gantt'])

export function SlideChartViz({ chart, dark }: { chart: ChartSpec; dark: boolean }) {
  if (!chart?.data?.length || !chart?.yKeys?.length || !chart?.xKey) {
    return <div className="w-full h-full flex items-center justify-center text-sm opacity-30">Loading chart…</div>
  }

  const colors = getColors(chart, dark)
  const textColor = dark ? '#ffffff' : '#082422'

  // Custom chart types render their own HTML instead of using ResponsiveContainer
  if (CUSTOM_CHART_TYPES.has(chart.chartType)) {
    return (
      <div className="w-full h-full" style={{ color: textColor }}>
        {renderCustomChart(chart, colors, dark)}
      </div>
    )
  }

  return (
    <div className="w-full h-full" style={{ color: textColor }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart(chart, colors, dark)}
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Custom chart renderers ─── */

function renderCustomChart(chart: ChartSpec, colors: string[], dark: boolean) {
  switch (chart.chartType) {
    case 'waterfall': return <WaterfallChart chart={chart} colors={colors} dark={dark} />
    case 'funnel': return <FunnelChart chart={chart} colors={colors} dark={dark} />
    case 'gauge': return <GaugeChart chart={chart} colors={colors} dark={dark} />
    case 'heatmap': return <HeatmapChart chart={chart} colors={colors} dark={dark} />
    case 'treemap': return <TreemapChart chart={chart} colors={colors} dark={dark} />
    case 'candlestick': return <CandlestickChart chart={chart} colors={colors} dark={dark} />
    case 'pictorial': return <PictorialChart chart={chart} colors={colors} dark={dark} />
    case 'gantt': return <GanttChart chart={chart} colors={colors} dark={dark} />
    default: return null
  }
}

type CustomChartProps = { chart: ChartSpec; colors: string[]; dark: boolean }

function WaterfallChart({ chart, colors, dark }: CustomChartProps) {
  const yKey = chart.yKeys[0]
  let running = 0
  const bars = chart.data.map((d, i) => {
    const val = d[yKey] as number
    const isTotal = d.total === true || i === chart.data.length - 1
    const start = isTotal ? 0 : running
    const height = isTotal ? running + val : val
    if (!isTotal) running += val
    return { label: d[chart.xKey], value: val, start, height: isTotal ? running + val : Math.abs(val), isTotal, isPositive: val >= 0 }
  })
  const maxVal = Math.max(...bars.map(b => Math.abs(b.start) + Math.abs(b.height)))
  const positiveMax = Math.max(...bars.map(b => b.isTotal ? b.height : b.start + (b.isPositive ? b.value : 0)))
  const negativeMin = Math.min(0, ...bars.map(b => b.start + (b.isPositive ? 0 : b.value)))
  const range = positiveMax - negativeMin
  const pct = (v: number) => ((v - negativeMin) / range) * 100

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end gap-1 px-4">
        {bars.map((b, i) => {
          const bottom = b.isTotal ? 0 : pct(Math.min(b.start, b.start + b.value))
          const h = b.isTotal ? pct(b.height) - pct(0) : (Math.abs(b.value) / range) * 100
          const color = b.isTotal ? colors[0] : b.isPositive ? (colors[2] || '#60D06F') : (colors[3] || '#F26629')
          return (
            <div key={i} className="flex-1 relative h-full">
              <div
                className="absolute left-1 right-1 rounded-t-md transition-all"
                style={{ bottom: `${bottom}%`, height: `${Math.max(h, 2)}%`, background: color, opacity: b.isTotal ? 1 : 0.85 }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 px-4 pt-2 pb-1">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 text-center text-[9px] opacity-60 truncate">{b.label}</div>
        ))}
      </div>
    </div>
  )
}

function FunnelChart({ chart, colors, dark }: CustomChartProps) {
  const yKey = chart.yKeys[0]
  const maxVal = Math.max(...chart.data.map(d => d[yKey] as number))
  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 px-4">
      {chart.data.map((d, i) => {
        const val = d[yKey] as number
        const width = (val / maxVal) * 100
        const prevVal = i > 0 ? chart.data[i - 1][yKey] as number : null
        const convRate = prevVal ? ((val / prevVal) * 100).toFixed(1) : null
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-right text-xs opacity-70 shrink-0 truncate">{d[chart.xKey]}</div>
            <div className="flex-1 relative h-8">
              <div
                className="h-full rounded-md flex items-center px-3 transition-all"
                style={{ width: `${Math.max(width, 8)}%`, background: colors[i % colors.length], opacity: 0.85 }}
              >
                <span className="text-xs font-bold" style={{ color: dark ? '#082422' : '#ffffff' }}>
                  {typeof val === 'number' ? val.toLocaleString() : val}
                </span>
              </div>
            </div>
            {convRate && (
              <div className="text-[10px] opacity-50 w-12 shrink-0">{convRate}%</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function GaugeChart({ chart, colors, dark }: CustomChartProps) {
  const value = chart.data[0]?.[chart.yKeys[0]] as number ?? 0
  const max = chart.max ?? 100
  const pct = Math.min(value / max, 1)
  const angle = pct * 180
  const color = colors[0]
  const trackColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative" style={{ width: '70%', paddingBottom: '35%' }}>
        <svg viewBox="0 0 200 110" className="absolute inset-0 w-full h-full">
          {/* Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={trackColor}
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${pct * 251.2} 251.2`}
          />
          {/* Value */}
          <text x="100" y="95" textAnchor="middle" fontSize="32" fontWeight="800" fill={color} fontFamily="var(--font-display, inherit)">
            {value}
          </text>
          <text x="100" y="108" textAnchor="middle" fontSize="10" fill={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}>
            of {max}
          </text>
        </svg>
      </div>
      {chart.yLabel && (
        <div className="text-xs opacity-50 mt-2">{chart.yLabel}</div>
      )}
    </div>
  )
}

function HeatmapChart({ chart, colors, dark }: CustomChartProps) {
  const yKey = chart.yKeys[0]
  const colLabels = chart.columns || []
  const rows = chart.data
  const allVals = rows.flatMap(r => {
    const vals = r[yKey]
    return Array.isArray(vals) ? vals : [vals]
  })
  const maxVal = Math.max(...allVals.map(Number).filter(v => !isNaN(v)), 1)
  const baseColor = colors[0]

  return (
    <div className="w-full h-full flex flex-col px-4 py-2">
      {colLabels.length > 0 && (
        <div className="flex gap-1 mb-1 pl-16">
          {colLabels.map(c => <div key={c} className="flex-1 text-center text-[9px] opacity-40">{c}</div>)}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-1">
        {rows.map((row, ri) => {
          const vals: number[] = Array.isArray(row[yKey]) ? row[yKey] : [row[yKey]]
          return (
            <div key={ri} className="flex gap-1 flex-1">
              <div className="w-14 flex items-center text-[10px] opacity-50 shrink-0 truncate">{row[chart.xKey]}</div>
              {vals.map((v, ci) => {
                const intensity = Math.min(Number(v) / maxVal, 1)
                return (
                  <div
                    key={ci}
                    className="flex-1 rounded-sm flex items-center justify-center text-[9px] font-bold"
                    style={{
                      background: baseColor,
                      opacity: 0.1 + intensity * 0.85,
                      color: intensity > 0.5 ? (dark ? '#082422' : '#ffffff') : 'transparent',
                    }}
                  >
                    {intensity > 0.3 ? v : ''}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[9px] opacity-40">Low</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map(o => (
          <div key={o} className="w-4 h-3 rounded-sm" style={{ background: baseColor, opacity: o }} />
        ))}
        <span className="text-[9px] opacity-40">High</span>
      </div>
    </div>
  )
}

function TreemapChart({ chart, colors, dark }: CustomChartProps) {
  const yKey = chart.yKeys[0]
  const total = chart.data.reduce((s, d) => s + (d[yKey] as number), 0)
  const sorted = [...chart.data].sort((a, b) => (b[yKey] as number) - (a[yKey] as number))

  return (
    <div className="w-full h-full flex gap-1.5 p-2">
      {/* Largest item takes left column */}
      {sorted.length > 0 && (
        <div
          className="rounded-xl flex flex-col justify-end p-3 relative overflow-hidden"
          style={{ background: colors[0], width: `${(sorted[0][yKey] as number / total) * 100}%`, minWidth: '20%' }}
        >
          <span className="font-display font-black text-4xl absolute top-2 right-3" style={{ color: 'rgba(0,0,0,0.15)' }}>
            {sorted[0][yKey]}%
          </span>
          <span className="font-display font-bold text-sm relative z-10" style={{ color: dark ? '#082422' : '#082422' }}>
            {sorted[0][chart.xKey]}
          </span>
        </div>
      )}
      {/* Rest stack in right column */}
      {sorted.length > 1 && (
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Split remaining items into rows */}
          {chunkItems(sorted.slice(1), 3).map((row, ri) => (
            <div key={ri} className="flex gap-1.5 flex-1">
              {row.map((d, ci) => {
                const idx = sorted.indexOf(d)
                return (
                  <div
                    key={ci}
                    className="rounded-xl flex flex-col justify-end p-3 relative overflow-hidden flex-1"
                    style={{ background: colors[idx % colors.length] }}
                  >
                    <span className="font-display font-black text-2xl absolute top-1 right-2" style={{ color: 'rgba(0,0,0,0.15)' }}>
                      {d[yKey]}%
                    </span>
                    <span className="font-display font-bold text-xs relative z-10" style={{ color: '#082422' }}>
                      {d[chart.xKey]}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function chunkItems<T>(arr: T[], perRow: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < arr.length; i += perRow) rows.push(arr.slice(i, i + perRow))
  return rows
}

function CandlestickChart({ chart, colors, dark }: CustomChartProps) {
  const maxHigh = Math.max(...chart.data.map(d => d.high as number))
  const minLow = Math.min(...chart.data.map(d => d.low as number))
  const range = maxHigh - minLow
  const pct = (v: number) => ((v - minLow) / range) * 100
  const upColor = colors[2] || '#60D06F'
  const downColor = colors[3] || '#F26629'

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end gap-1 px-4 relative">
        {chart.data.map((d, i) => {
          const open = d.open as number
          const close = d.close as number
          const high = d.high as number
          const low = d.low as number
          const isUp = close >= open
          const color = isUp ? upColor : downColor
          const bodyBottom = pct(Math.min(open, close))
          const bodyHeight = Math.max(pct(Math.abs(close - open)), 1)
          const wickBottom = pct(low)
          const wickHeight = pct(high) - wickBottom
          return (
            <div key={i} className="flex-1 relative h-full">
              {/* Wick */}
              <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{ bottom: `${wickBottom}%`, height: `${wickHeight}%`, background: color, opacity: 0.5 }} />
              {/* Body */}
              <div className="absolute left-1 right-1 rounded-sm" style={{ bottom: `${bodyBottom}%`, height: `${bodyHeight}%`, background: color }} />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 px-4 pt-2 pb-1">
        {chart.data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] opacity-60 truncate">{d[chart.xKey]}</div>
        ))}
      </div>
    </div>
  )
}

function PictorialChart({ chart, colors, dark }: CustomChartProps) {
  const yKey = chart.yKeys[0]
  const maxVal = Math.max(...chart.data.map(d => d[yKey] as number))
  const icon = '●'
  const iconsPer = 10

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 px-6">
      {chart.data.map((d, i) => {
        const val = d[yKey] as number
        const filled = Math.round((val / maxVal) * iconsPer)
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 text-right text-xs opacity-70 shrink-0 truncate">{d[chart.xKey]}</div>
            <div className="flex gap-1 flex-1">
              {Array.from({ length: iconsPer }).map((_, j) => (
                <span
                  key={j}
                  className="text-lg"
                  style={{ color: colors[i % colors.length], opacity: j < filled ? 0.9 : 0.15 }}
                >
                  {icon}
                </span>
              ))}
            </div>
            <div className="text-xs font-bold w-10 text-right" style={{ color: colors[i % colors.length] }}>
              {val}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function GanttChart({ chart, colors, dark }: CustomChartProps) {
  const allStarts = chart.data.map(d => d.start as number)
  const allEnds = chart.data.map(d => d.end as number)
  const minStart = Math.min(...allStarts)
  const maxEnd = Math.max(...allEnds)
  const range = maxEnd - minStart

  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 px-4">
      {chart.data.map((d, i) => {
        const start = d.start as number
        const end = d.end as number
        const left = ((start - minStart) / range) * 100
        const width = ((end - start) / range) * 100
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-right text-xs opacity-70 shrink-0 truncate">{d[chart.xKey]}</div>
            <div className="flex-1 relative h-7">
              <div className="absolute inset-0 rounded" style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }} />
              <div
                className="absolute h-full rounded flex items-center px-2"
                style={{ left: `${left}%`, width: `${Math.max(width, 3)}%`, background: colors[i % colors.length], opacity: 0.85 }}
              >
                <span className="text-[9px] font-bold truncate" style={{ color: '#082422' }}>
                  {d.label || `${start}-${end}`}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Recharts-based chart renderers ─── */

function renderChart(chart: ChartSpec, colors: string[], dark: boolean) {
  const AXIS_STYLE = axisStyle(dark)
  const tooltipStyle = {
    contentStyle: {
      background: dark ? '#1a2928' : '#ffffff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: 8,
      fontSize: 12,
      color: dark ? '#ffffff' : '#082422',
    },
    itemStyle: {
      color: dark ? '#ffffff' : '#082422',
    },
    cursor: false as const,
  }

  switch (chart.chartType) {
    case 'bar':
    case 'histogram':
      return (
        <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="25%" barGap={4}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={56}>
              {chart.chartType === 'histogram' && chart.data.map((_, j) => (
                <Cell key={j} fill={colors[j % colors.length]} opacity={0.85} />
              ))}
            </Bar>
          ))}
        </BarChart>
      )

    case 'horizontal-bar':
      return (
        <BarChart data={chart.data} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 10 }} barCategoryGap="25%" barGap={4}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} width={80} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[0, 4, 4, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      )

    case 'stacked-bar':
      return (
        <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="25%" barGap={4}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} stackId="a" fill={colors[i % colors.length]} maxBarSize={56} />
          ))}
        </BarChart>
      )

    case 'line':
    case 'multi-line':
      return (
        <LineChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i % colors.length]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: colors[i % colors.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      )

    case 'area':
      return (
        <AreaChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            {chart.yKeys.map((key, i) => (
              <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              fill={`url(#area-${key})`}
            />
          ))}
        </AreaChart>
      )

    case 'donut':
      return (
        <PieChart>
          <Pie
            data={chart.data}
            dataKey={chart.yKeys[0]}
            nameKey={chart.xKey}
            cx="50%"
            cy="45%"
            innerRadius="45%"
            outerRadius="70%"
            paddingAngle={2}
            strokeWidth={0}
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={{ stroke: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', strokeWidth: 1 }}
          >
            {chart.data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', paddingTop: 8 }}
          />
        </PieChart>
      )

    case 'scatter':
      return (
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} name={chart.xLabel} />
          <YAxis dataKey={chart.yKeys[0]} tick={AXIS_STYLE} axisLine={false} tickLine={false} name={chart.yLabel} />
          <Tooltip {...tooltipStyle} />
          <Scatter data={chart.data} fill={colors[0]}>
            {chart.data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      )

    case 'bubble':
      return (
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} name={chart.xLabel} />
          <YAxis dataKey={chart.yKeys[0]} tick={AXIS_STYLE} axisLine={false} tickLine={false} name={chart.yLabel} />
          {chart.zKey && <ZAxis dataKey={chart.zKey} range={[40, 400]} />}
          <Tooltip {...tooltipStyle} />
          <Scatter data={chart.data} fill={colors[0]}>
            {chart.data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} opacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      )

    case 'combo':
      const lineKeySet = new Set(chart.lineKeys || [])
      const barKeys = chart.yKeys.filter(k => !lineKeySet.has(k))
      const lineKeysArr = chart.yKeys.filter(k => lineKeySet.has(k))
      return (
        <ComposedChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="25%">
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {barKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={56} />
          ))}
          {lineKeysArr.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[(barKeys.length + i) % colors.length]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: colors[(barKeys.length + i) % colors.length] }}
            />
          ))}
        </ComposedChart>
      )

    case 'radar':
      return (
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chart.data}>
          <PolarGrid stroke="currentColor" opacity={0.1} />
          <PolarAngleAxis dataKey={chart.xKey} tick={AXIS_STYLE} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          {chart.yKeys.map((key, i) => (
            <Radar
              key={key}
              dataKey={key}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      )

    default:
      return (
        <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="25%" barGap={4}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={chart.xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {chart.yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={56} />
          ))}
        </BarChart>
      )
  }
}
