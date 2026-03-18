/**
 * Link detection, parsing, and service identification for studio content.
 * Supports markdown links [text](url), bare URLs, and rich embeds for
 * known services (Notion, ClickUp, Google Docs/Forms/Sheets, YouTube, etc.)
 */

export interface ParsedLink {
  text: string
  url: string
  service: LinkService | null
}

export type LinkService =
  | 'notion'
  | 'clickup'
  | 'google-docs'
  | 'google-sheets'
  | 'google-slides'
  | 'google-forms'
  | 'google-drive'
  | 'youtube'
  | 'figma'
  | 'linear'
  | 'jira'
  | 'confluence'
  | 'github'
  | 'loom'
  | 'miro'

interface ServiceMatcher {
  service: LinkService
  pattern: RegExp
  label: string
}

const SERVICE_MATCHERS: ServiceMatcher[] = [
  { service: 'notion', pattern: /notion\.so|notion\.site/, label: 'Notion' },
  { service: 'clickup', pattern: /app\.clickup\.com|clickup\.com/, label: 'ClickUp' },
  { service: 'google-forms', pattern: /docs\.google\.com\/forms/, label: 'Google Forms' },
  { service: 'google-sheets', pattern: /docs\.google\.com\/spreadsheets/, label: 'Google Sheets' },
  { service: 'google-slides', pattern: /docs\.google\.com\/presentation/, label: 'Google Slides' },
  { service: 'google-docs', pattern: /docs\.google\.com\/document/, label: 'Google Docs' },
  { service: 'google-drive', pattern: /drive\.google\.com/, label: 'Google Drive' },
  { service: 'youtube', pattern: /youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed/, label: 'YouTube' },
  { service: 'figma', pattern: /figma\.com\/(file|design|proto|board)/, label: 'Figma' },
  { service: 'linear', pattern: /linear\.app/, label: 'Linear' },
  { service: 'jira', pattern: /atlassian\.net\/.*\/browse|jira\..*\.com/, label: 'Jira' },
  { service: 'confluence', pattern: /atlassian\.net\/wiki|confluence\./, label: 'Confluence' },
  { service: 'github', pattern: /github\.com/, label: 'GitHub' },
  { service: 'loom', pattern: /loom\.com\/(share|embed)/, label: 'Loom' },
  { service: 'miro', pattern: /miro\.com\/app\/board/, label: 'Miro' },
]

/** Identify which service a URL belongs to */
export function detectService(url: string): LinkService | null {
  for (const { service, pattern } of SERVICE_MATCHERS) {
    if (pattern.test(url)) return service
  }
  return null
}

/** Get human-readable label for a service */
export function serviceLabel(service: LinkService): string {
  return SERVICE_MATCHERS.find(m => m.service === service)?.label ?? service
}

/** Extract YouTube video ID from a URL */
export function extractYouTubeId(url: string): string | null {
  const m =
    url.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/) ??
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ??
    url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

/** Extract Loom video ID from a URL */
export function extractLoomId(url: string): string | null {
  const m = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/)
  return m?.[1] ?? null
}

// Regex for markdown links: [text](url)
const MD_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g

// Regex for bare URLs (not already inside markdown link syntax)
const BARE_URL_RE = /(?<!\]\()(?<!\()(https?:\/\/[^\s<>\])]+)/g

/** Check if a line is a standalone link (whole line is just a URL or markdown link) */
export function isStandaloneLink(line: string): ParsedLink | null {
  const trimmed = line.trim()

  // Check markdown link: [text](url)
  const mdMatch = trimmed.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
  if (mdMatch) {
    return { text: mdMatch[1], url: mdMatch[2], service: detectService(mdMatch[2]) }
  }

  // Check bare URL
  const urlMatch = trimmed.match(/^(https?:\/\/[^\s<>]+)$/)
  if (urlMatch) {
    const url = urlMatch[1]
    return { text: prettifyUrl(url), url, service: detectService(url) }
  }

  return null
}

/** Prettify a URL for display (strip protocol, trailing slashes) */
export function prettifyUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/^www\./, '')
}

/**
 * Parse inline text and return segments of text, bold, and links.
 * Handles both **bold** and [text](url) / bare URLs.
 */
export interface InlineSegment {
  type: 'text' | 'bold' | 'link'
  content: string
  url?: string
  service?: LinkService | null
}

export function parseInlineContent(text: string): InlineSegment[] {
  // Combined regex for bold, markdown links, and bare URLs
  const INLINE_RE = /(\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(?<!\]\()(?<!\()https?:\/\/[^\s<>\])]+)/g

  const segments: InlineSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = INLINE_RE.exec(text)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    if (match[2] !== undefined) {
      // Bold: **text**
      segments.push({ type: 'bold', content: match[2] })
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // Markdown link: [text](url)
      segments.push({ type: 'link', content: match[3], url: match[4], service: detectService(match[4]) })
    } else {
      // Bare URL
      const url = match[0]
      segments.push({ type: 'link', content: prettifyUrl(url), url, service: detectService(url) })
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }]
}

/** Check if text contains any links */
export function hasLinks(text: string): boolean {
  return MD_LINK_RE.test(text) || BARE_URL_RE.test(text)
}
