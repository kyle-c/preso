import { redis } from './studio-db'

/* ═══════════════════════════════════════════════════════════ */
/*                       BRAND KIT                             */
/*                                                              */
/*  Brand configuration that replaces hardcoded Félix values   */
/*  in the generation system prompt. Template interpolation     */
/*  approach: SYSTEM_PROMPT is a template with {{brand.*}}     */
/*  variables, filled from the active brand kit at gen time.   */
/* ═══════════════════════════════════════════════════════════ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BrandColor {
  name: string
  hex: string
  usage?: string // e.g. "signature brand color", "dark backgrounds"
}

export interface BrandIllustration {
  url: string
  category: string
  description: string
}

export interface BrandKit {
  id: string
  userId: string
  name: string
  /** Company description for the system prompt intro */
  description: string
  /** Mission statement */
  mission: string
  /** Tone of voice guidance */
  tone: string
  /** Display / heading font */
  displayFont: string
  /** Body / UI font */
  bodyFont: string
  /** Primary colors */
  primaryColors: BrandColor[]
  /** Secondary colors */
  secondaryColors: BrandColor[]
  /** Neutral colors */
  neutralColors: BrandColor[]
  /** Dark background hex */
  darkBg: string
  /** Light background hex */
  lightBg: string
  /** Brand/accent background hex */
  brandBg: string
  /** Available illustrations */
  illustrations: BrandIllustration[]
  /** Raw JSON/MD source if uploaded */
  rawSource?: string
  createdAt: number
  updatedAt: number
}

// ---------------------------------------------------------------------------
// Default Félix brand kit
// ---------------------------------------------------------------------------

export const FELIX_BRAND_KIT: Omit<BrandKit, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  name: 'Félix Pago',
  description: 'a fintech company that empowers Latinos in the US to care for what matters most back home',
  mission: 'Empower Latinos in the US to care for what matters most back home',
  tone: 'Clean, confident, contemporary fintech aesthetic. Warm and inclusive.',
  displayFont: 'Plain (font-weight 800-900)',
  bodyFont: 'Saans (font-weight 300-600)',
  darkBg: '#082422',
  lightBg: '#EFEBE7',
  brandBg: '#2BF2F1',
  primaryColors: [
    { name: 'Turquoise', hex: '#2BF2F1', usage: 'signature brand color' },
    { name: 'Slate', hex: '#082422', usage: 'dark backgrounds' },
  ],
  secondaryColors: [
    { name: 'Blueberry', hex: '#6060BF' },
    { name: 'Cactus', hex: '#60D06F' },
    { name: 'Mango', hex: '#F19D38' },
    { name: 'Papaya', hex: '#F26629' },
    { name: 'Lime', hex: '#DCFF00' },
    { name: 'Lychee', hex: '#FFCD9C' },
    { name: 'Sage', hex: '#7BA882' },
  ],
  neutralColors: [
    { name: 'Stone', hex: '#EFEBE7', usage: 'light backgrounds' },
    { name: 'Linen', hex: '#FEFCF9' },
    { name: 'Concrete', hex: '#CFCABF' },
    { name: 'Mocha', hex: '#877867' },
    { name: 'Evergreen', hex: '#35605F' },
  ],
  illustrations: [
    { url: '/illustrations/Dollar%20bills%20%2B%20Coins%20A.svg', category: 'Financial', description: 'dollar bills and coins (financial topics, costs, budgets)' },
    { url: '/illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg', category: 'Financial', description: 'flying money (growth, revenue, remittances)' },
    { url: '/illustrations/Cloud%20Coin%20-%20Turquoise.svg', category: 'Financial', description: 'cloud with coin (digital finance)' },
    { url: '/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg', category: 'Financial', description: 'paper airplane with coin (sending money, transfers)' },
    { url: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg', category: 'Growth', description: 'rocket launch (growth, ambition, scaling)' },
    { url: '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg', category: 'Growth', description: 'three paper airplanes (multiple products, scaling)' },
    { url: '/illustrations/ray.svg', category: 'Growth', description: 'starburst ray (excellence, quality)' },
    { url: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg', category: 'People', description: 'two hands with phones (collaboration)' },
    { url: '/illustrations/Hand%20-%20Stars.svg', category: 'People', description: 'hand with stars (welcome, celebration)' },
    { url: '/illustrations/Hand%20-%20Cell%20Phone%20OK.svg', category: 'People', description: 'hand with phone OK (mobile UX, approval)' },
    { url: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg', category: 'Communication', description: 'speech bubbles with hearts (user love, feedback)' },
    { url: '/illustrations/Speech%20Bubble.svg', category: 'Communication', description: 'speech bubble (communication, support)' },
    { url: '/illustrations/Party%20Popper.svg', category: 'Celebration', description: 'party popper (welcome, milestones)' },
    { url: '/illustrations/Heart%20-F%C3%A9lix.svg', category: 'Celebration', description: 'Félix heart (brand love, values)' },
    { url: '/illustrations/Fast.svg', category: 'Objects', description: 'speed/lightning (urgency, action)' },
    { url: '/illustrations/Magnifying%20Glass.svg', category: 'Objects', description: 'magnifying glass (research, discovery)' },
    { url: '/illustrations/Lock.svg', category: 'Objects', description: 'lock (security, trust)' },
    { url: '/illustrations/Survey.svg', category: 'Objects', description: 'survey/clipboard (research, planning)' },
    { url: '/illustrations/F%C3%A9lix%20Illo%201.svg', category: 'Mascot', description: 'Félix mascot (company intro, brand slides)' },
    { url: '/illustrations/F%C3%A9lix%20Illo%202.svg', category: 'Mascot', description: 'Félix mascot alternate' },
  ],
}

// ---------------------------------------------------------------------------
// Prompt serialization — converts a brand kit into the system prompt section
// ---------------------------------------------------------------------------

export function serializeBrandForPrompt(brand: Omit<BrandKit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'rawSource'>): string {
  const colorLine = (colors: BrandColor[]) =>
    colors.map(c => `${c.name} ${c.hex}${c.usage ? ` (${c.usage})` : ''}`).join(', ')

  const illustrationLines = () => {
    const byCategory = new Map<string, BrandIllustration[]>()
    for (const ill of brand.illustrations) {
      const list = byCategory.get(ill.category) || []
      list.push(ill)
      byCategory.set(ill.category, list)
    }
    let out = ''
    for (const [cat, items] of byCategory) {
      out += `\n**${cat}:**\n`
      for (const item of items) {
        out += `- ${item.url} — ${item.description}\n`
      }
    }
    return out
  }

  return `## About ${brand.name}
- Mission: ${brand.mission}
- Tone: ${brand.tone}

## Brand Identity
### Typography
- Display / headings: ${brand.displayFont}
- Body / UI text: ${brand.bodyFont}

### Color Palette
Primary: ${colorLine(brand.primaryColors)}
Secondary: ${colorLine(brand.secondaryColors)}
Neutral: ${colorLine(brand.neutralColors)}

### Available Illustrations
Use these illustrations throughout presentations. Every presentation should include at least 3-4 slides with illustrations. Use the imageUrl field with these exact paths:
${illustrationLines()}
### Background Colors
- Dark background: ${brand.darkBg}
- Light background: ${brand.lightBg}
- Brand/accent background: ${brand.brandBg}
`
}

// ---------------------------------------------------------------------------
// Redis storage
// ---------------------------------------------------------------------------

const brandKitKey = (userId: string) => `studio:brand-kit:${userId}`

export async function getBrandKit(userId: string): Promise<BrandKit | null> {
  const raw = await redis.get<string | BrandKit>(brandKitKey(userId))
  if (!raw) return null
  return typeof raw === 'string' ? JSON.parse(raw) as BrandKit : raw
}

export async function saveBrandKit(userId: string, kit: Omit<BrandKit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<BrandKit> {
  const existing = await getBrandKit(userId)
  const now = Math.floor(Date.now() / 1000)

  const fullKit: BrandKit = {
    ...kit,
    id: existing?.id || crypto.randomUUID(),
    userId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  await redis.set(brandKitKey(userId), JSON.stringify(fullKit))
  return fullKit
}

export async function deleteBrandKit(userId: string): Promise<void> {
  await redis.del(brandKitKey(userId))
}

// ---------------------------------------------------------------------------
// JSON/MD brand file parsing
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// JSON parsing helpers — handle many common design system formats
// ---------------------------------------------------------------------------

/** Resolve a font from various JSON structures */
function resolveJsonFont(data: any, ...keys: string[]): string {
  // Try: data.fonts.display, data.typography.fontFamilies.display, data.fontFamilies.display
  for (const key of keys) {
    const sources = [
      data.fonts?.[key],
      data.typography?.fontFamilies?.[key],
      data.typography?.fonts?.[key],
      data.typography?.[key],
      data.fontFamilies?.[key],
      data[`${key}Font`],
    ]
    for (const val of sources) {
      if (!val) continue
      // Could be a string "Inter" or an object { family: "Inter", weights: "400-700" }
      if (typeof val === 'string') return val
      if (val.family) {
        let weights = val.weights || val.weight || ''
        // Handle array of weight objects: [{ value: 800, name: 'ExtraBold' }]
        if (Array.isArray(weights)) {
          weights = weights.map((w: any) => typeof w === 'object' ? (w.name || w.value) : w).join(', ')
        }
        return weights ? `${val.family} (${weights})` : val.family
      }
    }
  }
  return 'System default'
}

/** Resolve a background color from various JSON structures */
function resolveJsonBg(data: any, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const sources = [
      data.colors?.[`${key}Bg`],
      data.colors?.backgrounds?.[key],
      data.colors?.background?.[key],
      data.backgrounds?.[key],
      data[`${key}Bg`],
    ]
    for (const val of sources) {
      if (typeof val === 'string' && val.startsWith('#')) return val
    }
    // Also check if a named color matches: { primary: { turquoise: "#2BF2F1" } }
    if (key === 'primary' || key === 'accent' || key === 'brand') {
      const primary = data.colors?.primary
      if (typeof primary === 'object' && !Array.isArray(primary)) {
        const firstHex = Object.values(primary).find((v: any) => typeof v === 'string' && v.startsWith('#'))
        if (firstHex) return firstHex as string
      }
    }
  }
  return undefined
}

/**
 * Resolve a color group from various JSON structures.
 * Handles:
 *   - Array of objects: [{ name, hex, usage }]
 *   - Array of strings: ["#hex1", "#hex2"]
 *   - Object map: { turquoise: "#2BF2F1", slate: "#082422" }
 *   - Nested: { colors: { primary: { turquoise: "#2BF2F1" } } }
 */
function resolveJsonColorGroup(data: any, ...keys: string[]): BrandColor[] {
  for (const key of keys) {
    const sources = [
      data.colors?.[key],
      data[`${key}Colors`],
      data.palette?.[key],
      data.colors?.palette?.[key],
    ]
    for (const val of sources) {
      if (!val) continue
      const parsed = parseColorValue(val)
      if (parsed.length > 0) return parsed
    }
  }
  return []
}

/** Parse a color value that could be an array, object map, or single string */
function parseColorValue(val: any): BrandColor[] {
  if (Array.isArray(val)) {
    return val.map((c: any) => {
      if (typeof c === 'string') return { name: c, hex: c }
      return { name: c.name || c.label || c.hex || '', hex: c.hex || c.value || c.color || '', usage: c.usage || c.description }
    }).filter(c => c.hex)
  }
  if (typeof val === 'object' && val !== null) {
    // Object map: { turquoise: "#2BF2F1", slate: "#082422" }
    return Object.entries(val)
      .filter(([_, v]) => typeof v === 'string' && (v as string).startsWith('#'))
      .map(([name, hex]) => ({ name: capitalize(name), hex: hex as string }))
  }
  return []
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').trim()
}

/** Resolve illustrations from various JSON structures */
function resolveJsonIllustrations(data: any): BrandIllustration[] {
  const raw = data.illustrations || data.assets?.illustrations || data.images || []
  if (!Array.isArray(raw)) return []
  return raw.map((ill: any) => ({
    url: ill.url || ill.path || ill.src || '',
    category: ill.category || ill.group || 'Uncategorized',
    description: ill.description || ill.alt || ill.label || '',
  })).filter((ill: BrandIllustration) => ill.url)
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseBrandFile(content: string, filename: string): Omit<BrandKit, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | { error: string } {
  const isJson = filename.endsWith('.json')

  if (isJson) {
    try {
      const raw = JSON.parse(content)
      // Unwrap common wrapper keys: { designSystem: { ... } }, { brand: { ... } }, { theme: { ... } }
      // Only unwrap if the wrapper contains nested brand data (has name or colors inside)
      const unwrap = raw.designSystem || raw.brand || raw.theme
      const data = (unwrap && typeof unwrap === 'object' && (unwrap.name || unwrap.colors || unwrap.fonts)) ? unwrap : raw

      return {
        name: data.name || data.metadata?.name || 'Untitled Brand',
        description: data.description || data.metadata?.description || '',
        mission: data.mission || data.metadata?.mission || '',
        tone: data.tone || data.voice || data.metadata?.tone || '',
        displayFont: resolveJsonFont(data, 'display', 'heading', 'title'),
        bodyFont: resolveJsonFont(data, 'body', 'text', 'paragraph'),
        darkBg: resolveJsonBg(data, 'dark') || '#1a1a2e',
        lightBg: resolveJsonBg(data, 'light') || '#f5f5f5',
        brandBg: resolveJsonBg(data, 'brand', 'accent', 'primary') || '#3b82f6',
        primaryColors: resolveJsonColorGroup(data, 'primary'),
        secondaryColors: resolveJsonColorGroup(data, 'secondary'),
        neutralColors: resolveJsonColorGroup(data, 'neutral', 'gray', 'grey'),
        illustrations: resolveJsonIllustrations(data),
        rawSource: content,
      }
    } catch {
      return { error: 'Invalid JSON file. Please check the format.' }
    }
  }

  // Markdown — intelligent parsing
  return parseMdBrandFile(content)
}

function parseMdBrandFile(rawContent: string): Omit<BrandKit, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  // Strip HTML tags if the content is HTML, preserving text
  const content = rawContent.includes('<html') || rawContent.includes('<!DOCTYPE')
    ? rawContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ')
    : rawContent

  // Try to find brand name from title tags, headings, or content
  const titleMatch = rawContent.match(/<title>([^<]+)<\/title>/i)
  const name = extractMdHeading(content) || titleMatch?.[1]?.trim() || extractBrandNameFromContent(content) || 'Untitled Brand'

  // Extract colors from markdown tables: | Name | Hex | ... |
  const colorTableRows = extractMdTableColors(content)

  // Classify colors by section heading context
  const primaryColors: BrandColor[] = []
  const secondaryColors: BrandColor[] = []
  const neutralColors: BrandColor[] = []
  let currentSection = ''

  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Track section headings
    const headingMatch = line.match(/^#{1,4}\s+(.+)/i)
    if (headingMatch) {
      currentSection = headingMatch[1].toLowerCase()
    }
    // Check if this line is a table row with a color
    const tableMatch = line.match(/\|\s*([^|]+)\s*\|\s*`?(#[0-9a-fA-F]{3,8})`?\s*\|(.*)/)
    if (tableMatch) {
      const colorName = tableMatch[1].trim()
      const hex = tableMatch[2].trim()
      const rest = tableMatch[3]
      // Extract usage from remaining columns
      const usageMatch = rest.match(/\|\s*([^|]+)\s*$/)
      const usage = usageMatch ? usageMatch[1].trim() : undefined

      const color: BrandColor = { name: colorName, hex, usage: usage || undefined }

      if (currentSection.includes('primary')) primaryColors.push(color)
      else if (currentSection.includes('secondary')) secondaryColors.push(color)
      else if (currentSection.includes('neutral')) neutralColors.push(color)
      else if (currentSection.includes('semantic') || currentSection.includes('token')) { /* skip tokens */ }
      else if (currentSection.includes('scale')) { /* skip color scales */ }
      else primaryColors.push(color) // default to primary
    }
  }

  // Fallback: if no colors found from tables, try text-based extraction
  if (primaryColors.length === 0 && secondaryColors.length === 0 && neutralColors.length === 0) {
    const textColors = extractHexColorsFromText(content)
    // Heuristic classification: first 2 are primary, next chunk secondary, last chunk neutral
    const knownPrimary = ['turquoise', 'blue', 'brand', 'primary', 'accent']
    const knownNeutral = ['stone', 'gray', 'grey', 'neutral', 'concrete', 'linen', 'slate', 'mocha', 'muted', 'white', 'black']
    for (const c of textColors) {
      const lower = c.name.toLowerCase()
      if (knownNeutral.some(k => lower.includes(k))) neutralColors.push(c)
      else if (knownPrimary.some(k => lower.includes(k)) || primaryColors.length < 2) primaryColors.push(c)
      else secondaryColors.push(c)
    }
  }

  // Extract fonts from tables: | Role | Family | Weights | ... |
  let displayFont = 'System default'
  let bodyFont = 'System default'
  const fontTableMatch = content.match(/\|\s*Display\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/i)
  if (fontTableMatch) {
    const family = fontTableMatch[1].trim()
    const weights = fontTableMatch[2].trim()
    displayFont = `${family} (${weights})`
  }
  const bodyFontMatch = content.match(/\|\s*Body\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/i)
  if (bodyFontMatch) {
    const family = bodyFontMatch[1].trim()
    const weights = bodyFontMatch[2].trim()
    bodyFont = `${family} (${weights})`
  }

  // Fallback font extraction from plain text: "Display: Plain" or "font-family: Inter"
  if (displayFont === 'System default') {
    const displayMatch = content.match(/(?:display|heading)[^:]*:\s*([A-Z][a-zA-Z\s]+?)(?:\s*[\(,]|$)/im)
    if (displayMatch) displayFont = displayMatch[1].trim()
  }
  if (bodyFont === 'System default') {
    const bodyMatch = content.match(/(?:body|text|paragraph)[^:]*:\s*([A-Z][a-zA-Z\s]+?)(?:\s*[\(,]|$)/im)
    if (bodyMatch) bodyFont = bodyMatch[1].trim()
  }

  // Extract background colors from semantic tokens or known patterns
  const darkBg = findColorHex(content, 'slate', 'dark background', 'foreground') || primaryColors.find(c => isColorDarkCheck(c.hex))?.hex || '#082422'
  const lightBg = findColorHex(content, 'stone', 'light background', 'linen') || neutralColors.find(c => !isColorDarkCheck(c.hex))?.hex || '#EFEBE7'
  const brandBg = findColorHex(content, 'turquoise', 'primary accent', 'brand') || primaryColors[0]?.hex || '#2BF2F1'

  // Extract design principles or tone
  const toneMatch = content.match(/###?\s*(?:tone|voice|style)\s*\n([\s\S]*?)(?=\n##|\n---|\z)/i)
  let tone = toneMatch ? toneMatch[1].trim().split('\n')[0].replace(/^[-*]\s*/, '') : extractMdField(content, 'tone') || ''
  // Fallback tone from plain text
  if (!tone) {
    const toneTextMatch = content.match(/(?:tone|voice)\s*[:]\s*([^\n.]+)/i)
    if (toneTextMatch) tone = toneTextMatch[1].trim()
  }

  // Extract mission/description from intro or blockquote
  const blockquoteMatch = content.match(/^>\s*(.+)/m)
  let description = blockquoteMatch ? blockquoteMatch[1].replace(/^>\s*/g, '').trim() : ''
  // Fallback: look for a description meta tag or text near the brand name
  if (!description) {
    const descMatch = rawContent.match(/description["']?\s*(?:content=["']|:\s*["'])([^"']+)/i)
    if (descMatch) description = descMatch[1].trim()
  }

  // Extract principles
  const principlesSection = content.match(/##?\s*Design Principles\s*\n([\s\S]*?)(?=\n---|\n##[^#])/i)
  let mission = principlesSection
    ? principlesSection[1].split('\n').filter(l => /^\d+\./.test(l.trim())).map(l => l.replace(/^\d+\.\s*\*\*([^*]+)\*\*.*/, '$1')).slice(0, 3).join(', ')
    : ''
  // Fallback: look for "Presence Over Transaction" pattern in plain text
  if (!mission) {
    const missionMatch = content.match(/Presence Over Transaction/i)
    if (missionMatch) mission = 'Presence Over Transaction, Progressive Capability, Meet People Where They Are'
  }

  // Extract illustrations from categories table or list
  const illustrations = extractMdIllustrations(content)

  return {
    name,
    description,
    mission,
    tone,
    displayFont,
    bodyFont,
    darkBg,
    lightBg,
    brandBg,
    primaryColors,
    secondaryColors,
    neutralColors,
    illustrations,
    rawSource: content,
  }
}

/** Extract all hex colors from markdown table rows */
function extractMdTableColors(content: string): BrandColor[] {
  const colors: BrandColor[] = []
  const regex = /\|\s*([^|]+)\s*\|\s*`?(#[0-9a-fA-F]{3,8})`?\s*\|/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const name = match[1].trim()
    const hex = match[2].trim()
    if (name && hex && !name.includes('---') && !name.toLowerCase().includes('name') && !name.toLowerCase().includes('token')) {
      colors.push({ name, hex })
    }
  }
  return colors
}

/** Find a hex color by looking for known names in the content */
function findColorHex(content: string, ...keywords: string[]): string | undefined {
  for (const kw of keywords) {
    // Look in table: | Name | #hex |
    const tableMatch = content.match(new RegExp(`\\|\\s*${kw}[^|]*\\|\\s*\`?(#[0-9a-fA-F]{3,8})\`?\\s*\\|`, 'i'))
    if (tableMatch) return tableMatch[1]
    // Look in semantic token: `--background` | linen `#FEFCF9`
    const tokenMatch = content.match(new RegExp(`${kw}[^#]*(#[0-9a-fA-F]{3,8})`, 'i'))
    if (tokenMatch) return tokenMatch[1]
  }
  return undefined
}

function isColorDarkCheck(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

/** Extract illustrations from markdown content */
function extractMdIllustrations(content: string): BrandIllustration[] {
  const illustrations: BrandIllustration[] = []
  // Look for illustration paths in the content
  const pathRegex = /\/illustrations\/([^\s"'`|,)]+)/g
  const seen = new Set<string>()
  let match
  while ((match = pathRegex.exec(content)) !== null) {
    const url = `/illustrations/${match[1]}`
    if (seen.has(url)) continue
    seen.add(url)
    const filename = decodeURIComponent(match[1]).replace(/\.[^.]+$/, '')
    illustrations.push({
      url,
      category: categorizeIllustration(filename),
      description: filename.replace(/[-_]/g, ' '),
    })
  }
  return illustrations
}

/** Try to extract a brand name from content by looking for common patterns */
function extractBrandNameFromContent(content: string): string | undefined {
  // Look for "X Design System", "X Brand", "X Style Guide"
  const patterns = [
    /([A-Z][a-zA-Zé\s]+?)(?:\s*[-—–]\s*)?Design System/,
    /([A-Z][a-zA-Zé\s]+?)(?:\s*[-—–]\s*)?Brand Guide/,
    /([A-Z][a-zA-Zé\s]+?)(?:\s*[-—–]\s*)?Style Guide/,
    /([A-Z][a-zA-Zé\s]+?)(?:\s*[-—–]\s*)?Brand Kit/,
  ]
  for (const pat of patterns) {
    const match = content.match(pat)
    if (match) return match[1].trim()
  }
  return undefined
}

/** Extract hex colors from any text (not just tables) */
function extractHexColorsFromText(content: string): BrandColor[] {
  const colors: BrandColor[] = []
  const seen = new Set<string>()
  // Match patterns like "Turquoise #2BF2F1" or "turquoise: #2BF2F1" or "name (#2BF2F1)"
  const regex = /([A-Za-z][A-Za-z\s-]{1,20}?)[\s:]*[(`]?(#[0-9a-fA-F]{6})[)`]?/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const hex = match[2].toUpperCase()
    if (seen.has(hex)) continue
    seen.add(hex)
    const name = match[1].trim().replace(/^[-:]\s*/, '')
    if (name && !name.includes('---') && name.length > 1) {
      colors.push({ name, hex })
    }
  }
  return colors
}

function extractMdField(content: string, field: string): string | undefined {
  const regex = new RegExp(`(?:^|\\n)[-*]?\\s*\\**${field}\\**\\s*[:=]\\s*(.+)`, 'im')
  const match = content.match(regex)
  return match?.[1]?.trim()
}

function extractMdHeading(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)/m)
  return match?.[1]?.trim()
}

// ---------------------------------------------------------------------------
// Auto-categorize uploaded illustrations by filename
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Financial': ['dollar', 'money', 'coin', 'payment', 'cash', 'finance', 'bank', 'wallet'],
  'Growth': ['rocket', 'growth', 'arrow', 'chart', 'airplane', 'ray', 'star'],
  'People': ['hand', 'person', 'people', 'team', 'phone', 'user'],
  'Communication': ['speech', 'bubble', 'chat', 'message', 'email'],
  'Celebration': ['party', 'heart', 'celebration', 'confetti', 'popper'],
  'Objects': ['lock', 'key', 'magnifying', 'search', 'survey', 'clipboard', 'fast', 'speed'],
  'Hero': ['hero', 'banner', 'cover', 'header'],
  'Icon': ['icon', 'ico', 'symbol', 'glyph'],
  'Logo': ['logo', 'mark', 'brand', 'mascot'],
}

export function categorizeIllustration(filename: string): string {
  const lower = filename.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return category
  }
  return 'Uncategorized'
}
