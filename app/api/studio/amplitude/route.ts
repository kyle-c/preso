import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserId } from '@/lib/studio-auth'
import { getUserSettings } from '@/lib/studio-db'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Amplitude API helper — fetches chart data, user metrics, and event data
// ---------------------------------------------------------------------------

function authHeader(apiKey: string, secretKey: string): string {
  return 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
}

/** Parse an Amplitude chart URL or raw chart ID */
function parseChartId(input: string): string | null {
  const trimmed = input.trim()

  // Raw chart ID (alphanumeric)
  if (/^[a-z0-9]+$/i.test(trimmed) && trimmed.length > 4) {
    return trimmed
  }

  // URL: https://app.amplitude.com/analytics/org/chart/xxx or /chart/new/xxx
  try {
    const url = new URL(trimmed)
    if (!url.hostname.includes('amplitude.com')) return null
    const match = url.pathname.match(/\/chart\/(?:new\/)?([a-z0-9]+)/i)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

/** Detect region from URL or default to US */
function detectRegion(input: string): 'us' | 'eu' {
  try {
    const url = new URL(input.trim())
    if (url.hostname.includes('.eu.') || url.hostname.includes('analytics.eu')) return 'eu'
  } catch { /* not a URL */ }
  return 'us'
}

function baseUrl(region: 'us' | 'eu'): string {
  return region === 'eu' ? 'https://analytics.eu.amplitude.com' : 'https://amplitude.com'
}

/** Format a date as YYYYMMDD */
function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

/** Default date range: last 30 days */
function defaultRange(): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { start: formatDate(start), end: formatDate(end) }
}

// ---------------------------------------------------------------------------
// Chart export (GET /api/3/chart/{id}/csv)
// ---------------------------------------------------------------------------

async function fetchChart(
  chartId: string,
  apiKey: string,
  secretKey: string,
  region: 'us' | 'eu',
): Promise<{ title: string; data: string }> {
  const url = `${baseUrl(region)}/api/3/chart/${chartId}/query`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(apiKey, secretKey) },
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid Amplitude credentials. Check your API key and secret key.')
    }
    if (res.status === 404) {
      throw new Error('Chart not found. Make sure the chart ID is correct and accessible with these credentials.')
    }
    throw new Error(`Amplitude API error: ${res.status}`)
  }

  const json = await res.json()

  // The response structure varies by chart type but generally has:
  // { data: { series: [...], seriesLabels: [...], xValues: [...] } }
  const chartData = json.data ?? json
  const title = json.title ?? `Amplitude Chart ${chartId}`

  // Convert to a readable markdown/CSV format
  const markdown = chartDataToMarkdown(title, chartData)
  return { title, data: markdown }
}

function chartDataToMarkdown(title: string, chartData: any): string {
  const lines: string[] = [`# ${title}`, '']

  const series = chartData.series ?? chartData.seriesCollapsed ?? []
  const labels = chartData.seriesLabels ?? chartData.seriesMeta ?? []
  const xValues = chartData.xValues ?? []

  if (series.length === 0) {
    // Try flat data format
    if (chartData.data && Array.isArray(chartData.data)) {
      lines.push('| Metric | Value |')
      lines.push('| --- | --- |')
      for (const row of chartData.data) {
        if (typeof row === 'object') {
          for (const [k, v] of Object.entries(row)) {
            lines.push(`| ${k} | ${v} |`)
          }
        }
      }
      return lines.join('\n')
    }
    lines.push('*No series data available*')
    return lines.join('\n')
  }

  // Build a table with xValues as rows and each series as a column
  const seriesNames = labels.map((l: any, i: number) => {
    if (typeof l === 'string') return l
    return l?.label ?? l?.eventName ?? `Series ${i + 1}`
  })

  if (xValues.length > 0 && series[0] && Array.isArray(series[0])) {
    // Time series format: series[i][j] = value at xValues[j]
    const header = `| Date | ${seriesNames.join(' | ')} |`
    const separator = `| --- | ${seriesNames.map(() => '---').join(' | ')} |`
    lines.push(header, separator)

    for (let j = 0; j < xValues.length; j++) {
      const values = series.map((s: any) => {
        const val = Array.isArray(s) ? s[j] : s
        if (val == null) return ''
        if (typeof val === 'object' && val.value !== undefined) return formatNumber(val.value)
        return formatNumber(val)
      })
      lines.push(`| ${xValues[j]} | ${values.join(' | ')} |`)
    }
  } else {
    // Aggregate format: one value per series
    lines.push('| Metric | Value |')
    lines.push('| --- | --- |')
    for (let i = 0; i < series.length; i++) {
      const val = Array.isArray(series[i]) ? series[i][0] : series[i]
      lines.push(`| ${seriesNames[i]} | ${formatNumber(val)} |`)
    }
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// User counts (GET /api/2/users)
// ---------------------------------------------------------------------------

async function fetchUserCounts(
  apiKey: string,
  secretKey: string,
  region: 'us' | 'eu',
  start?: string,
  end?: string,
  mode: 'active' | 'new' = 'active',
  interval: number = -1, // -1 = daily (default)
): Promise<{ title: string; data: string }> {
  const range = start && end ? { start, end } : defaultRange()
  const params = new URLSearchParams({
    start: range.start,
    end: range.end,
    m: mode,
    i: String(interval),
  })

  const url = `${baseUrl(region)}/api/2/users?${params}`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(apiKey, secretKey) },
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid Amplitude credentials.')
    }
    throw new Error(`Amplitude API error: ${res.status}`)
  }

  const json = await res.json()
  const seriesData = json.data?.series ?? []
  const xValues = json.data?.xValues ?? []

  const title = mode === 'new' ? 'New Users' : 'Active Users'
  const lines = [`# ${title}`, '', '| Date | Users |', '| --- | --- |']

  if (seriesData.length > 0 && Array.isArray(seriesData[0])) {
    for (let i = 0; i < xValues.length; i++) {
      lines.push(`| ${xValues[i]} | ${formatNumber(seriesData[0][i])} |`)
    }
  }

  return { title, data: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Event segmentation (GET /api/2/events/segmentation)
// ---------------------------------------------------------------------------

async function fetchEventSegmentation(
  apiKey: string,
  secretKey: string,
  region: 'us' | 'eu',
  eventName: string,
  start?: string,
  end?: string,
  metric: string = 'uniques', // uniques, totals, avg, pct_dau
): Promise<{ title: string; data: string }> {
  const range = start && end ? { start, end } : defaultRange()

  const eventDef = JSON.stringify({ event_type: eventName })
  const params = new URLSearchParams({
    e: eventDef,
    start: range.start,
    end: range.end,
    m: metric,
    i: '-1', // daily
  })

  const url = `${baseUrl(region)}/api/2/events/segmentation?${params}`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(apiKey, secretKey) },
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid Amplitude credentials.')
    }
    throw new Error(`Amplitude API error: ${res.status}`)
  }

  const json = await res.json()
  const seriesData = json.data?.series ?? []
  const xValues = json.data?.xValues ?? []

  const metricLabel = { uniques: 'Unique Users', totals: 'Total Events', avg: 'Average', pct_dau: '% of DAU' }[metric] ?? metric
  const title = `${eventName} — ${metricLabel}`
  const lines = [`# ${title}`, '', `| Date | ${metricLabel} |`, '| --- | --- |']

  if (seriesData.length > 0) {
    const values = Array.isArray(seriesData[0]) ? seriesData[0] : seriesData
    for (let i = 0; i < xValues.length; i++) {
      lines.push(`| ${xValues[i]} | ${formatNumber(values[i])} |`)
    }
  }

  return { title, data: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Event list (GET /api/2/events/list)
// ---------------------------------------------------------------------------

async function fetchEventList(
  apiKey: string,
  secretKey: string,
  region: 'us' | 'eu',
): Promise<{ title: string; data: string }> {
  const url = `${baseUrl(region)}/api/2/events/list`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(apiKey, secretKey) },
  })

  if (!res.ok) throw new Error(`Amplitude API error: ${res.status}`)

  const json = await res.json()
  const events = json.data ?? []

  const lines = ['# Event Summary (last 7 days)', '', '| Event | Weekly Users | Weekly Events | % DAU |', '| --- | --- | --- | --- |']

  // Sort by weekly users descending, take top 30
  const sorted = events
    .filter((e: any) => !e.non_active)
    .sort((a: any, b: any) => (b.totals?.users_last_week ?? 0) - (a.totals?.users_last_week ?? 0))
    .slice(0, 30)

  for (const event of sorted) {
    const name = event.name ?? event.event_type ?? 'Unknown'
    const users = formatNumber(event.totals?.users_last_week ?? 0)
    const count = formatNumber(event.totals?.events_last_week ?? 0)
    const pct = event.totals?.pct_dau_last_week != null
      ? `${(event.totals.pct_dau_last_week * 100).toFixed(1)}%`
      : ''
    lines.push(`| ${name} | ${users} | ${count} | ${pct} |`)
  }

  return { title: 'Event Summary', data: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Revenue LTV (GET /api/2/revenue/ltv)
// ---------------------------------------------------------------------------

async function fetchRevenue(
  apiKey: string,
  secretKey: string,
  region: 'us' | 'eu',
  start?: string,
  end?: string,
  metric: string = 'revenue', // revenue, arpu, arppu, paying
): Promise<{ title: string; data: string }> {
  const range = start && end ? { start, end } : defaultRange()
  const params = new URLSearchParams({
    start: range.start,
    end: range.end,
    m: metric,
    i: '-1',
  })

  const url = `${baseUrl(region)}/api/2/revenue/ltv?${params}`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(apiKey, secretKey) },
  })

  if (!res.ok) throw new Error(`Amplitude API error: ${res.status}`)

  const json = await res.json()
  const seriesData = json.data?.series ?? []
  const xValues = json.data?.xValues ?? []

  const metricLabels: Record<string, string> = {
    revenue: 'Total Revenue',
    arpu: 'ARPU',
    arppu: 'ARPPU',
    paying: 'Paying Users',
  }
  const title = metricLabels[metric] ?? metric
  const lines = [`# ${title}`, '', `| Date | ${title} |`, '| --- | --- |']

  if (seriesData.length > 0 && Array.isArray(seriesData[0])) {
    for (let i = 0; i < xValues.length; i++) {
      const val = metric === 'revenue' || metric === 'arpu' || metric === 'arppu'
        ? `$${formatNumber(seriesData[0][i])}`
        : formatNumber(seriesData[0][i])
      lines.push(`| ${xValues[i]} | ${val} |`)
    }
  }

  return { title, data: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(val: any): string {
  if (val == null) return ''
  const num = typeof val === 'number' ? val : Number(val)
  if (isNaN(num)) return String(val)
  if (Number.isInteger(num)) return num.toLocaleString('en-US')
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

interface AmplitudeRequest {
  /** What to fetch: 'chart' | 'users' | 'events' | 'event-list' | 'revenue' */
  type: string
  /** Chart URL or ID (for type='chart') */
  url?: string
  /** Amplitude API key */
  amplitudeApiKey: string
  /** Amplitude secret key */
  amplitudeSecretKey: string
  /** Event name (for type='events') */
  eventName?: string
  /** Metric: 'uniques' | 'totals' | 'avg' | 'pct_dau' | 'active' | 'new' | 'revenue' | 'arpu' | 'arppu' | 'paying' */
  metric?: string
  /** Date range (YYYYMMDD) */
  start?: string
  end?: string
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = (await req.json()) as Omit<AmplitudeRequest, 'amplitudeApiKey' | 'amplitudeSecretKey'>

    const settings = await getUserSettings(userId)
    const amplitudeApiKey = settings.amplitudeApiKey
    const amplitudeSecretKey = settings.amplitudeSecretKey
    if (!amplitudeApiKey || !amplitudeSecretKey) {
      return NextResponse.json(
        { error: 'Amplitude API key and secret key are required. Add them in Settings → Integrations.' },
        { status: 400 },
      )
    }

    const region = body.url ? detectRegion(body.url) : 'us'
    let result: { title: string; data: string }

    switch (body.type) {
      case 'chart': {
        if (!body.url) {
          return NextResponse.json({ error: 'Chart URL or ID is required' }, { status: 400 })
        }
        const chartId = parseChartId(body.url)
        if (!chartId) {
          return NextResponse.json({ error: 'Could not parse Amplitude chart URL. Use a chart URL from app.amplitude.com.' }, { status: 400 })
        }
        result = await fetchChart(chartId, amplitudeApiKey, amplitudeSecretKey, region)
        break
      }

      case 'users':
        result = await fetchUserCounts(
          amplitudeApiKey, amplitudeSecretKey, region,
          body.start, body.end,
          (body.metric as 'active' | 'new') ?? 'active',
        )
        break

      case 'events':
        if (!body.eventName) {
          return NextResponse.json({ error: 'Event name is required' }, { status: 400 })
        }
        result = await fetchEventSegmentation(
          amplitudeApiKey, amplitudeSecretKey, region,
          body.eventName, body.start, body.end,
          body.metric ?? 'uniques',
        )
        break

      case 'event-list':
        result = await fetchEventList(amplitudeApiKey, amplitudeSecretKey, region)
        break

      case 'revenue':
        result = await fetchRevenue(
          amplitudeApiKey, amplitudeSecretKey, region,
          body.start, body.end,
          body.metric ?? 'revenue',
        )
        break

      default:
        return NextResponse.json({ error: `Unknown type: ${body.type}. Use 'chart', 'users', 'events', 'event-list', or 'revenue'.` }, { status: 400 })
    }

    return NextResponse.json({
      title: result.title,
      markdown: result.data,
    })
  } catch (err: any) {
    console.error('[studio/amplitude]', err)
    return NextResponse.json(
      { error: err?.message?.slice(0, 200) ?? 'Failed to fetch Amplitude data' },
      { status: 500 },
    )
  }
}
