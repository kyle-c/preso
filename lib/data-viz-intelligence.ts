/* ═══════════════════════════════════════════════════════════ */
/*                DATA VISUALIZATION INTELLIGENCE              */
/*                                                              */
/*  Analyzes data shape and recommends the best chart type     */
/*  before generation. Injected as a constraint into the       */
/*  generation prompt so the AI picks appropriate charts.      */
/* ═══════════════════════════════════════════════════════════ */

export interface DataShape {
  type: 'time-series' | 'categorical' | 'hierarchical' | 'proportional' | 'comparison' | 'distribution' | 'relationship' | 'progress' | 'unknown'
  columns: number
  rows: number
  hasTimeDimension: boolean
  hasPercentages: boolean
  hasCurrency: boolean
  seriesCount: number
}

export interface ChartRecommendation {
  chartType: string
  confidence: number // 0-1
  reason: string
}

/** Analyze a CSV/table data string and detect its shape */
export function analyzeDataShape(data: string): DataShape {
  const lines = data.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return { type: 'unknown', columns: 0, rows: 0, hasTimeDimension: false, hasPercentages: false, hasCurrency: false, seriesCount: 0 }

  // Parse as CSV or table
  const separator = data.includes('\t') ? '\t' : data.includes('|') ? '|' : ','
  const rows = lines.map(l => l.split(separator).map(c => c.trim().replace(/^\||\|$/g, '').trim()))
  const headers = rows[0]
  const dataRows = rows.slice(1).filter(r => !r.every(c => /^[-=]+$/.test(c))) // skip separator rows

  const columns = headers.length
  const rowCount = dataRows.length

  // Detect time dimension
  const timePatterns = /\b(year|month|quarter|q[1-4]|date|time|week|day|20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i
  const hasTimeDimension = headers.some(h => timePatterns.test(h)) ||
    dataRows.some(r => r[0] && timePatterns.test(r[0]))

  // Detect percentages and currency
  const allValues = dataRows.flat().join(' ')
  const hasPercentages = /\d+(\.\d+)?%/.test(allValues)
  const hasCurrency = /\$[\d,.]+|\d+(\.\d+)?\s*(USD|EUR|MXN)/.test(allValues)

  // Count numeric series (columns that are mostly numbers)
  const numericCols = headers.filter((_, i) => {
    const vals = dataRows.map(r => r[i] || '')
    const numCount = vals.filter(v => /^[\d$,.%+-]+$/.test(v.replace(/[,$%]/g, ''))).length
    return numCount > vals.length * 0.5
  })
  const seriesCount = numericCols.length

  // Classify shape
  let type: DataShape['type'] = 'unknown'
  if (hasTimeDimension && seriesCount >= 1) type = 'time-series'
  else if (hasPercentages && rowCount <= 8) type = 'proportional'
  else if (seriesCount >= 2 && rowCount >= 3) type = 'comparison'
  else if (rowCount <= 6 && seriesCount === 1) type = 'categorical'
  else if (seriesCount >= 3) type = 'relationship'
  else if (rowCount >= 10) type = 'distribution'
  else type = 'categorical'

  return { type, columns, rows: rowCount, hasTimeDimension, hasPercentages, hasCurrency, seriesCount }
}

/** Recommend chart types based on data shape */
export function recommendCharts(shape: DataShape): ChartRecommendation[] {
  const recs: ChartRecommendation[] = []

  switch (shape.type) {
    case 'time-series':
      recs.push({ chartType: 'line', confidence: 0.9, reason: 'Time series data is best shown as a line chart to reveal trends' })
      if (shape.seriesCount > 1) recs.push({ chartType: 'multi-line', confidence: 0.85, reason: 'Multiple series over time — multi-line shows comparison' })
      recs.push({ chartType: 'area', confidence: 0.7, reason: 'Area chart emphasizes volume/magnitude over time' })
      if (shape.seriesCount > 1) recs.push({ chartType: 'stacked-bar', confidence: 0.6, reason: 'Stacked bars show composition changes over time' })
      break

    case 'proportional':
      recs.push({ chartType: 'donut', confidence: 0.9, reason: 'Proportional data (percentages) maps naturally to a donut chart' })
      recs.push({ chartType: 'bar', confidence: 0.7, reason: 'Bar chart provides easier exact value comparison' })
      if (shape.rows >= 5) recs.push({ chartType: 'treemap', confidence: 0.65, reason: 'Many categories — treemap shows hierarchy and proportion' })
      break

    case 'comparison':
      recs.push({ chartType: 'bar', confidence: 0.85, reason: 'Side-by-side bars are the clearest comparison visual' })
      recs.push({ chartType: 'horizontal-bar', confidence: 0.8, reason: 'Horizontal bars work well when category names are long' })
      if (shape.seriesCount === 2) recs.push({ chartType: 'combo', confidence: 0.7, reason: 'Two metrics — combo chart (bars + line) shows dual scales' })
      recs.push({ chartType: 'radar', confidence: 0.5, reason: 'Radar chart for multi-dimensional comparison (use sparingly)' })
      break

    case 'categorical':
      recs.push({ chartType: 'bar', confidence: 0.85, reason: 'Simple categorical data is clearest as a bar chart' })
      recs.push({ chartType: 'horizontal-bar', confidence: 0.8, reason: 'Horizontal bars for ranked/sorted categories' })
      if (shape.rows <= 5) recs.push({ chartType: 'donut', confidence: 0.6, reason: 'Few categories — donut shows parts of a whole' })
      break

    case 'distribution':
      recs.push({ chartType: 'histogram', confidence: 0.85, reason: 'Distribution data is best shown as a histogram' })
      recs.push({ chartType: 'scatter', confidence: 0.7, reason: 'Scatter plot reveals clusters and outliers' })
      recs.push({ chartType: 'bar', confidence: 0.6, reason: 'Bar chart as fallback for binned distribution' })
      break

    case 'relationship':
      recs.push({ chartType: 'scatter', confidence: 0.85, reason: 'Scatter plot shows relationships between variables' })
      recs.push({ chartType: 'bubble', confidence: 0.75, reason: 'Bubble chart adds a third dimension via size' })
      recs.push({ chartType: 'heatmap', confidence: 0.6, reason: 'Heatmap for dense multi-variable relationships' })
      break

    case 'progress':
      recs.push({ chartType: 'gauge', confidence: 0.9, reason: 'Progress toward a target is best shown as a gauge' })
      recs.push({ chartType: 'bar', confidence: 0.7, reason: 'Bar chart with target line as alternative' })
      break

    default:
      recs.push({ chartType: 'bar', confidence: 0.6, reason: 'Default — bar chart works for most data types' })
      break
  }

  return recs.sort((a, b) => b.confidence - a.confidence)
}

/** Format chart recommendations as a prompt constraint */
export function formatChartConstraint(data: string): string {
  const shape = analyzeDataShape(data)
  if (shape.type === 'unknown') return ''

  const recs = recommendCharts(shape)
  if (recs.length === 0) return ''

  const topRec = recs[0]
  const altRecs = recs.slice(1, 3)

  return `\n\nDATA VISUALIZATION GUIDANCE:
The attached data appears to be ${shape.type} data (${shape.rows} rows, ${shape.seriesCount} numeric series${shape.hasTimeDimension ? ', time-based' : ''}${shape.hasPercentages ? ', percentages' : ''}${shape.hasCurrency ? ', currency values' : ''}).

RECOMMENDED chart type: "${topRec.chartType}" — ${topRec.reason}
${altRecs.length > 0 ? `Alternatives: ${altRecs.map(r => `"${r.chartType}" (${r.reason})`).join(', ')}` : ''}

When creating chart slides for this data, use chartType: "${topRec.chartType}" in the ChartSpec unless another type clearly fits better.`
}
