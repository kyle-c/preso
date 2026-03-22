import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserId } from '@/lib/studio-auth'
import { getUserSettings } from '@/lib/studio-db'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Google Workspace API — fetches Sheets, Docs, and Slides data
// Uses a Google Cloud API key (documents must be link-shared)
// ---------------------------------------------------------------------------

/** Parse a Google Workspace URL and extract the document ID + type */
function parseGoogleUrl(input: string): { id: string; type: 'sheets' | 'docs' | 'slides' } | null {
  const trimmed = input.trim()

  try {
    const url = new URL(trimmed)
    if (!url.hostname.includes('google.com')) return null

    // Sheets: docs.google.com/spreadsheets/d/{id}/...
    const sheetsMatch = url.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
    if (sheetsMatch) return { id: sheetsMatch[1], type: 'sheets' }

    // Docs: docs.google.com/document/d/{id}/...
    const docsMatch = url.pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)
    if (docsMatch) return { id: docsMatch[1], type: 'docs' }

    // Slides: docs.google.com/presentation/d/{id}/...
    const slidesMatch = url.pathname.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
    if (slidesMatch) return { id: slidesMatch[1], type: 'slides' }

    return null
  } catch {
    // Try as raw ID with explicit type
    return null
  }
}

// ---------------------------------------------------------------------------
// Google Sheets
// ---------------------------------------------------------------------------

async function fetchSheet(
  spreadsheetId: string,
  apiKey: string,
): Promise<{ title: string; data: string }> {
  // Fetch spreadsheet metadata + all sheet data
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${encodeURIComponent(apiKey)}&includeGridData=false`
  const res = await fetch(url)

  if (!res.ok) {
    handleGoogleError(res.status, 'spreadsheet')
  }

  const meta = await res.json()
  const title = meta.properties?.title ?? 'Google Sheet'
  const sheets = meta.sheets ?? []

  const lines: string[] = [`# ${title}`, '']

  // Fetch values for each sheet
  for (const sheet of sheets) {
    const sheetTitle = sheet.properties?.title ?? 'Sheet'
    const sheetId = encodeURIComponent(sheetTitle)

    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${encodeURIComponent(apiKey)}`
    const valuesRes = await fetch(valuesUrl)

    if (!valuesRes.ok) continue

    const valuesData = await valuesRes.json()
    const rows: string[][] = valuesData.values ?? []

    if (rows.length === 0) continue

    lines.push(`## ${sheetTitle}`, '')

    // First row as header
    const header = rows[0]
    lines.push(`| ${header.join(' | ')} |`)
    lines.push(`| ${header.map(() => '---').join(' | ')} |`)

    // Data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      // Pad to header length
      while (row.length < header.length) row.push('')
      lines.push(`| ${row.map(cell => String(cell ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`)
    }

    lines.push('')
  }

  return { title, data: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Google Docs
// ---------------------------------------------------------------------------

async function fetchDoc(
  documentId: string,
  apiKey: string,
): Promise<{ title: string; data: string }> {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}?key=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)

  if (!res.ok) {
    handleGoogleError(res.status, 'document')
  }

  const doc = await res.json()
  const title = doc.title ?? 'Google Doc'
  const body = doc.body?.content ?? []

  const lines: string[] = [`# ${title}`, '']

  for (const element of body) {
    if (element.paragraph) {
      const paragraph = element.paragraph
      const text = paragraphToMarkdown(paragraph)
      if (text.trim()) lines.push(text)
      else lines.push('')
    } else if (element.table) {
      const tableLines = tableToMarkdown(element.table)
      lines.push(...tableLines)
      lines.push('')
    } else if (element.sectionBreak) {
      lines.push('---')
      lines.push('')
    }
  }

  return { title, data: lines.join('\n') }
}

/** Convert a Google Docs paragraph to markdown */
function paragraphToMarkdown(paragraph: any): string {
  const style = paragraph.paragraphStyle?.namedStyleType ?? ''
  const elements = paragraph.elements ?? []
  let text = ''

  for (const elem of elements) {
    if (elem.textRun) {
      const content = elem.textRun.content ?? ''
      const textStyle = elem.textRun.textStyle ?? {}

      let segment = content

      // Apply inline formatting
      if (textStyle.bold && textStyle.italic) {
        segment = `***${segment.trim()}***`
      } else if (textStyle.bold) {
        segment = `**${segment.trim()}**`
      } else if (textStyle.italic) {
        segment = `*${segment.trim()}*`
      }
      if (textStyle.strikethrough) {
        segment = `~~${segment.trim()}~~`
      }

      // Links
      if (textStyle.link?.url) {
        segment = `[${segment.trim()}](${textStyle.link.url})`
      }

      text += segment
    } else if (elem.inlineObjectElement) {
      // Images — reference by ID (not directly accessible without OAuth)
      text += '[image]'
    }
  }

  // Strip trailing newline that Docs adds to every paragraph
  text = text.replace(/\n$/, '')

  // Apply heading styles
  if (style === 'HEADING_1') return `# ${text}`
  if (style === 'HEADING_2') return `## ${text}`
  if (style === 'HEADING_3') return `### ${text}`
  if (style === 'HEADING_4') return `#### ${text}`
  if (style === 'HEADING_5') return `##### ${text}`
  if (style === 'HEADING_6') return `###### ${text}`

  // Lists
  const bullet = paragraph.bullet
  if (bullet) {
    const level = bullet.nestingLevel ?? 0
    const indent = '  '.repeat(level)
    // Google Docs uses glyphType for ordered vs unordered
    const listId = bullet.listId
    return `${indent}- ${text}`
  }

  return text
}

/** Convert a Google Docs table to markdown */
function tableToMarkdown(table: any): string[] {
  const rows = table.tableRows ?? []
  if (rows.length === 0) return []

  const lines: string[] = []
  const allCells: string[][] = []

  for (const row of rows) {
    const cells = (row.tableCells ?? []).map((cell: any) => {
      const content = (cell.content ?? [])
        .map((c: any) => {
          if (c.paragraph) return paragraphToMarkdown(c.paragraph)
          return ''
        })
        .join(' ')
        .replace(/\|/g, '\\|')
        .replace(/\n/g, ' ')
        .trim()
      return content
    })
    allCells.push(cells)
  }

  if (allCells.length === 0) return []

  // First row as header
  lines.push(`| ${allCells[0].join(' | ')} |`)
  lines.push(`| ${allCells[0].map(() => '---').join(' | ')} |`)

  for (let i = 1; i < allCells.length; i++) {
    // Pad to header width
    while (allCells[i].length < allCells[0].length) allCells[i].push('')
    lines.push(`| ${allCells[i].join(' | ')} |`)
  }

  return lines
}

// ---------------------------------------------------------------------------
// Google Slides
// ---------------------------------------------------------------------------

async function fetchSlides(
  presentationId: string,
  apiKey: string,
): Promise<{ title: string; data: string }> {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}?key=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)

  if (!res.ok) {
    handleGoogleError(res.status, 'presentation')
  }

  const pres = await res.json()
  const title = pres.title ?? 'Google Slides'
  const slides = pres.slides ?? []

  const lines: string[] = [`# ${title}`, '', `*${slides.length} slides*`, '']

  // Structural summary for AI redesign
  lines.push('## Deck Structure')
  lines.push('')
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const slideTitle = extractSlideTitle(slide) || `Slide ${i + 1}`
    const layout = detectSlideLayout(slide)
    const hasTable = (slide.pageElements ?? []).some((e: any) => e.table)
    const elementCount = (slide.pageElements ?? []).length
    const meta = [layout, hasTable ? 'has table' : '', elementCount <= 2 ? 'minimal' : elementCount >= 6 ? 'dense' : ''].filter(Boolean).join(', ')
    lines.push(`${i + 1}. **${slideTitle}** — ${meta}`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const slideTitle = extractSlideTitle(slide) || `Slide ${i + 1}`
    const layout = detectSlideLayout(slide)

    lines.push(`## Slide ${i + 1}: ${slideTitle}`)
    lines.push(`*Layout: ${layout}*`)
    lines.push('')

    // Extract all text content from the slide
    const textContent = extractSlideText(slide)
    if (textContent.trim()) {
      lines.push(textContent)
      lines.push('')
    }

    // Extract speaker notes
    const notes = extractSpeakerNotes(slide)
    if (notes.trim()) {
      lines.push(`> **Speaker notes:** ${notes}`)
      lines.push('')
    }

    // Extract tables
    const tables = extractSlideTables(slide)
    if (tables.length > 0) {
      for (const table of tables) {
        lines.push(...table)
        lines.push('')
      }
    }
  }

  return { title, data: lines.join('\n') }
}

/** Detect the layout type of a slide based on its placeholder types and element arrangement */
function detectSlideLayout(slide: any): string {
  const elements = slide.pageElements ?? []
  const placeholderTypes = elements
    .map((e: any) => e.shape?.placeholder?.type)
    .filter(Boolean)

  const hasTitle = placeholderTypes.includes('TITLE') || placeholderTypes.includes('CENTERED_TITLE')
  const hasSubtitle = placeholderTypes.includes('SUBTITLE')
  const hasBody = placeholderTypes.includes('BODY')
  const hasTable = elements.some((e: any) => e.table)
  const hasImage = elements.some((e: any) => e.image)
  const textShapes = elements.filter((e: any) => e.shape?.text?.textElements?.length > 1)
  const bulletCount = elements.reduce((count: number, e: any) => {
    const bullets = (e.shape?.text?.textElements ?? []).filter((t: any) => t.paragraphMarker?.bullet)
    return count + bullets.length
  }, 0)

  if (hasTitle && hasSubtitle && textShapes.length <= 3) return 'title slide'
  if (hasTitle && !hasBody && textShapes.length <= 2) return 'section divider'
  if (hasTable) return 'data table'
  if (hasImage && textShapes.length <= 2) return 'image + text'
  if (bulletCount >= 4) return 'bullet list'
  if (textShapes.length >= 4) return 'multi-block (cards or columns)'
  if (hasTitle && hasBody) return 'title + body content'
  return 'content'
}

/** Extract the title from a slide (first text element with TITLE or large font) */
function extractSlideTitle(slide: any): string {
  const elements = slide.pageElements ?? []

  for (const elem of elements) {
    const shape = elem.shape
    if (!shape) continue

    const placeholder = shape.placeholder
    if (placeholder?.type === 'TITLE' || placeholder?.type === 'CENTERED_TITLE') {
      return extractTextFromShape(shape)
    }
  }

  // Fallback: first text element
  for (const elem of elements) {
    if (elem.shape) {
      const text = extractTextFromShape(elem.shape)
      if (text.trim().length > 0 && text.trim().length < 100) {
        return text.trim()
      }
    }
  }

  return ''
}

/** Extract all non-title text content from a slide */
function extractSlideText(slide: any): string {
  const elements = slide.pageElements ?? []
  const parts: string[] = []
  let skipFirst = true // Skip the title

  for (const elem of elements) {
    const shape = elem.shape
    if (!shape) continue

    const placeholder = shape.placeholder
    if (placeholder?.type === 'TITLE' || placeholder?.type === 'CENTERED_TITLE') {
      continue // Skip title
    }

    const text = extractTextFromShape(shape)
    if (text.trim()) {
      parts.push(text.trim())
    }
  }

  return parts.join('\n\n')
}

/** Extract text from a shape element with basic formatting */
function extractTextFromShape(shape: any): string {
  const textElements = shape.text?.textElements ?? []
  let result = ''

  for (const elem of textElements) {
    if (elem.textRun) {
      let content = elem.textRun.content ?? ''
      const style = elem.textRun.style ?? {}

      // Inline formatting
      if (content.trim()) {
        if (style.bold) content = `**${content.trim()}** `
        if (style.italic) content = `*${content.trim()}* `
        if (style.link?.url) content = `[${content.trim()}](${style.link.url}) `
      }

      result += content
    } else if (elem.paragraphMarker) {
      const bullet = elem.paragraphMarker.bullet
      if (bullet) {
        // Insert bullet marker at the start of the line
        const level = bullet.nestingLevel ?? 0
        const indent = '  '.repeat(level)
        result += `${indent}- `
      }
    }
  }

  return result.trim()
}

/** Extract speaker notes from a slide */
function extractSpeakerNotes(slide: any): string {
  const notes = slide.slideProperties?.notesPage
  if (!notes) return ''

  const elements = notes.pageElements ?? []
  for (const elem of elements) {
    const shape = elem.shape
    if (!shape) continue

    const placeholder = shape.placeholder
    if (placeholder?.type === 'BODY') {
      return extractTextFromShape(shape)
    }
  }

  return ''
}

/** Extract tables from slide elements */
function extractSlideTables(slide: any): string[][] {
  const elements = slide.pageElements ?? []
  const tables: string[][] = []

  for (const elem of elements) {
    if (!elem.table) continue

    const rows = elem.table.tableRows ?? []
    if (rows.length === 0) continue

    const tableLines: string[] = []
    const allCells: string[][] = []

    for (const row of rows) {
      const cells = (row.tableCells ?? []).map((cell: any) => {
        const text = (cell.text?.textElements ?? [])
          .filter((e: any) => e.textRun)
          .map((e: any) => (e.textRun.content ?? '').replace(/\n/g, ' ').replace(/\|/g, '\\|'))
          .join('')
          .trim()
        return text
      })
      allCells.push(cells)
    }

    if (allCells.length > 0) {
      tableLines.push(`| ${allCells[0].join(' | ')} |`)
      tableLines.push(`| ${allCells[0].map(() => '---').join(' | ')} |`)
      for (let i = 1; i < allCells.length; i++) {
        while (allCells[i].length < allCells[0].length) allCells[i].push('')
        tableLines.push(`| ${allCells[i].join(' | ')} |`)
      }
      tables.push(tableLines)
    }
  }

  return tables
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

function handleGoogleError(status: number, resourceType: string): never {
  if (status === 401 || status === 403) {
    throw new Error(
      `Cannot access this ${resourceType}. Make sure it's shared as "Anyone with the link" and your API key has the correct APIs enabled.`
    )
  }
  if (status === 404) {
    throw new Error(
      `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} not found. Check the URL and make sure the document exists.`
    )
  }
  throw new Error(`Google API error: ${status}`)
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

interface GoogleWorkspaceRequest {
  /** Google Workspace URL (Sheets, Docs, or Slides) */
  url: string
  /** Google Cloud API key with Sheets/Docs/Slides APIs enabled */
  googleWorkspaceKey: string
  /** Override auto-detected type: 'sheets' | 'docs' | 'slides' */
  type?: 'sheets' | 'docs' | 'slides'
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = (await req.json()) as Omit<GoogleWorkspaceRequest, 'googleWorkspaceKey'>

    if (!body.url) {
      return NextResponse.json(
        { error: 'A Google Sheets, Docs, or Slides URL is required.' },
        { status: 400 },
      )
    }

    const settings = await getUserSettings(userId)
    const googleWorkspaceKey = settings.googleWorkspaceKey
    if (!googleWorkspaceKey) {
      return NextResponse.json(
        { error: 'Google API key is required. Add it in Settings → Integrations.' },
        { status: 400 },
      )
    }

    const parsed = parseGoogleUrl(body.url)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Could not parse Google URL. Use a URL from docs.google.com (Sheets, Docs, or Slides).' },
        { status: 400 },
      )
    }

    const docType = body.type ?? parsed.type
    let result: { title: string; data: string }

    switch (docType) {
      case 'sheets':
        result = await fetchSheet(parsed.id, googleWorkspaceKey)
        break
      case 'docs':
        result = await fetchDoc(parsed.id, googleWorkspaceKey)
        break
      case 'slides':
        result = await fetchSlides(parsed.id, googleWorkspaceKey)
        break
      default:
        return NextResponse.json(
          { error: `Unknown document type. Supported: sheets, docs, slides.` },
          { status: 400 },
        )
    }

    return NextResponse.json({
      title: result.title,
      markdown: result.data,
      type: docType,
    })
  } catch (err: any) {
    console.error('[studio/google-workspace]', err)
    return NextResponse.json(
      { error: err?.message?.slice(0, 200) ?? 'Failed to fetch Google Workspace data' },
      { status: 500 },
    )
  }
}
