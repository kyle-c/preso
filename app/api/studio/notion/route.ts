import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserId } from '@/lib/studio-auth'
import { getUserSettings } from '@/lib/studio-db'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Notion API helper — fetches a page + its block children, converts to markdown
// ---------------------------------------------------------------------------

interface NotionBlock {
  id: string
  type: string
  has_children: boolean
  [key: string]: any
}

/** Extract plain text from Notion rich_text array */
function richTextToMarkdown(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return ''
  return richText.map((t: any) => {
    let text = t.plain_text ?? ''
    if (t.annotations?.bold) text = `**${text}**`
    if (t.annotations?.italic) text = `*${text}*`
    if (t.annotations?.code) text = `\`${text}\``
    if (t.annotations?.strikethrough) text = `~~${text}~~`
    if (t.href) text = `[${text}](${t.href})`
    return text
  }).join('')
}

/** Convert a single Notion block to markdown */
function blockToMarkdown(block: NotionBlock, indent = 0): string {
  const prefix = '  '.repeat(indent)
  const data = block[block.type]
  if (!data) return ''

  switch (block.type) {
    case 'paragraph':
      return prefix + richTextToMarkdown(data.rich_text)
    case 'heading_1':
      return `# ${richTextToMarkdown(data.rich_text)}`
    case 'heading_2':
      return `## ${richTextToMarkdown(data.rich_text)}`
    case 'heading_3':
      return `### ${richTextToMarkdown(data.rich_text)}`
    case 'bulleted_list_item':
      return `${prefix}- ${richTextToMarkdown(data.rich_text)}`
    case 'numbered_list_item':
      return `${prefix}1. ${richTextToMarkdown(data.rich_text)}`
    case 'to_do': {
      const checked = data.checked ? 'x' : ' '
      return `${prefix}- [${checked}] ${richTextToMarkdown(data.rich_text)}`
    }
    case 'toggle':
      return `${prefix}> ${richTextToMarkdown(data.rich_text)}`
    case 'quote':
      return `${prefix}> ${richTextToMarkdown(data.rich_text)}`
    case 'callout': {
      const icon = data.icon?.emoji ?? ''
      return `${prefix}> ${icon} ${richTextToMarkdown(data.rich_text)}`
    }
    case 'code':
      return `\`\`\`${data.language ?? ''}\n${richTextToMarkdown(data.rich_text)}\n\`\`\``
    case 'divider':
      return '---'
    case 'table_of_contents':
      return '' // Skip ToC blocks
    case 'image': {
      const url = data.file?.url ?? data.external?.url ?? ''
      const caption = data.caption ? richTextToMarkdown(data.caption) : ''
      return url ? `![${caption}](${url})` : ''
    }
    case 'bookmark':
      return data.url ? `[${data.url}](${data.url})` : ''
    case 'link_preview':
      return data.url ? `[${data.url}](${data.url})` : ''
    case 'embed':
      return data.url ? `[Embed: ${data.url}](${data.url})` : ''
    case 'video': {
      const vUrl = data.file?.url ?? data.external?.url ?? ''
      return vUrl ? `[Video: ${vUrl}](${vUrl})` : ''
    }
    case 'child_page':
      return `**📄 ${data.title}**`
    case 'child_database':
      return `**🗄 ${data.title}**`
    case 'synced_block':
      return '' // Children will be fetched separately
    case 'column_list':
    case 'column':
      return '' // Children handled recursively
    default:
      return ''
  }
}

/** Recursively fetch all blocks (handles pagination + children) */
async function fetchAllBlocks(
  parentId: string,
  apiKey: string,
  depth = 0,
  maxDepth = 3,
): Promise<string[]> {
  if (depth > maxDepth) return []

  const lines: string[] = []
  let cursor: string | undefined

  do {
    const url = `https://api.notion.com/v1/blocks/${parentId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      throw new Error(`Notion API error ${res.status}: ${errBody.slice(0, 200)}`)
    }

    const data = await res.json()
    const blocks: NotionBlock[] = data.results ?? []

    for (const block of blocks) {
      const md = blockToMarkdown(block, depth > 0 ? 1 : 0)
      if (md) lines.push(md)

      // Recursively fetch children (toggles, columns, synced blocks, etc.)
      if (block.has_children) {
        const childLines = await fetchAllBlocks(block.id, apiKey, depth + 1, maxDepth)
        lines.push(...childLines)
      }
    }

    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)

  return lines
}

/** Fetch page properties (title, etc.) */
async function fetchPageInfo(pageId: string, apiKey: string): Promise<{ title: string; url: string }> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Notion API error ${res.status}: ${errBody.slice(0, 200)}`)
  }

  const page = await res.json()
  let title = 'Untitled'

  // Extract title from page properties
  const props = page.properties ?? {}
  for (const prop of Object.values(props) as any[]) {
    if (prop.type === 'title' && prop.title?.length > 0) {
      title = prop.title.map((t: any) => t.plain_text).join('')
      break
    }
  }

  return { title, url: page.url ?? '' }
}

/** Fetch database rows as a markdown table */
async function fetchDatabaseAsTable(
  databaseId: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Notion database query error ${res.status}: ${errBody.slice(0, 200)}`)
  }

  const data = await res.json()
  const rows = data.results ?? []
  if (rows.length === 0) return '*Empty database*'

  // Extract all property names from first row
  const propNames = Object.keys(rows[0]?.properties ?? {})
  if (propNames.length === 0) return '*No properties*'

  // Build markdown table
  const header = '| ' + propNames.join(' | ') + ' |'
  const separator = '| ' + propNames.map(() => '---').join(' | ') + ' |'

  const dataRows = rows.map((row: any) => {
    const cells = propNames.map(name => {
      const prop = row.properties[name]
      return extractPropertyValue(prop)
    })
    return '| ' + cells.join(' | ') + ' |'
  })

  return [header, separator, ...dataRows].join('\n')
}

/** Extract display value from a Notion property */
function extractPropertyValue(prop: any): string {
  if (!prop) return ''
  switch (prop.type) {
    case 'title':
      return prop.title?.map((t: any) => t.plain_text).join('') ?? ''
    case 'rich_text':
      return prop.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
    case 'number':
      return prop.number != null ? String(prop.number) : ''
    case 'select':
      return prop.select?.name ?? ''
    case 'multi_select':
      return prop.multi_select?.map((s: any) => s.name).join(', ') ?? ''
    case 'date':
      return prop.date?.start ?? ''
    case 'checkbox':
      return prop.checkbox ? '✓' : '✗'
    case 'url':
      return prop.url ?? ''
    case 'email':
      return prop.email ?? ''
    case 'phone_number':
      return prop.phone_number ?? ''
    case 'status':
      return prop.status?.name ?? ''
    case 'formula':
      return prop.formula?.string ?? prop.formula?.number?.toString() ?? ''
    case 'relation':
      return prop.relation?.length ? `${prop.relation.length} linked` : ''
    case 'rollup':
      return prop.rollup?.number?.toString() ?? prop.rollup?.array?.length?.toString() ?? ''
    case 'people':
      return prop.people?.map((p: any) => p.name ?? 'Unknown').join(', ') ?? ''
    case 'created_time':
      return prop.created_time ?? ''
    case 'last_edited_time':
      return prop.last_edited_time ?? ''
    default:
      return ''
  }
}

// ---------------------------------------------------------------------------
// Extract page/database ID from Notion URL or raw ID
// ---------------------------------------------------------------------------

function parseNotionIdentifier(input: string): { id: string; type: 'page' | 'database' } | null {
  const trimmed = input.trim()

  // Direct UUID (with or without dashes)
  const uuidRe = /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i
  if (uuidRe.test(trimmed)) {
    const id = trimmed.replace(/-/g, '')
    return { id: formatNotionId(id), type: 'page' }
  }

  // Notion URL patterns
  try {
    const url = new URL(trimmed)
    if (!url.hostname.includes('notion.so') && !url.hostname.includes('notion.site')) return null

    const path = url.pathname

    // Database view: /xxx/abc123def456?v=...
    // Page: /xxx/Title-abc123def456 or /abc123def456
    // The last 32 hex chars in the path (without dashes) are the ID
    const hexMatch = path.match(/([a-f0-9]{32})(?:\?|$)/i) ?? path.match(/([a-f0-9]{32})/i)
    if (hexMatch) {
      const id = formatNotionId(hexMatch[1])
      // If URL has ?v= parameter, it's likely a database view
      const isDb = url.searchParams.has('v') || path.includes('/database/')
      return { id, type: isDb ? 'database' : 'page' }
    }
  } catch {
    // Not a URL
  }

  return null
}

function formatNotionId(hex: string): string {
  // Insert dashes: 8-4-4-4-12
  const h = hex.replace(/-/g, '')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// ---------------------------------------------------------------------------
// POST: Fetch a Notion page or database and return markdown content
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { url } = body as { url?: string }

    if (!url) {
      return NextResponse.json({ error: 'Notion URL or page ID is required' }, { status: 400 })
    }

    const settings = await getUserSettings(userId)
    const notionKey = settings.notionKey
    if (!notionKey) {
      return NextResponse.json({ error: 'Notion API key is required. Add it in Settings → Integrations.' }, { status: 400 })
    }

    const parsed = parseNotionIdentifier(url)
    if (!parsed) {
      return NextResponse.json({ error: 'Could not parse Notion URL. Use a page or database URL from notion.so.' }, { status: 400 })
    }

    const { id, type } = parsed

    if (type === 'database') {
      // Fetch database as markdown table
      const dbRes = await fetch(`https://api.notion.com/v1/databases/${id}`, {
        headers: {
          'Authorization': `Bearer ${notionKey}`,
          'Notion-Version': '2022-06-28',
        },
      })

      if (!dbRes.ok) {
        const status = dbRes.status
        if (status === 401 || status === 403) {
          return NextResponse.json({ error: 'Notion integration does not have access to this database. Make sure the integration is connected to the page.' }, { status: 403 })
        }
        if (status === 404) {
          return NextResponse.json({ error: 'Database not found. Check the URL and ensure the integration has access.' }, { status: 404 })
        }
        return NextResponse.json({ error: `Notion API error: ${status}` }, { status: 502 })
      }

      const dbInfo = await dbRes.json()
      const dbTitle = dbInfo.title?.map((t: any) => t.plain_text).join('') ?? 'Untitled Database'

      const tableMarkdown = await fetchDatabaseAsTable(id, notionKey)
      const markdown = `# ${dbTitle}\n\n${tableMarkdown}`

      return NextResponse.json({
        title: dbTitle,
        type: 'database',
        markdown,
        url: dbInfo.url ?? url,
      })
    }

    // Fetch page
    let pageInfo: { title: string; url: string }
    try {
      pageInfo = await fetchPageInfo(id, notionKey)
    } catch (err: any) {
      const msg = err?.message ?? ''
      if (msg.includes('401') || msg.includes('403')) {
        return NextResponse.json({ error: 'Notion integration does not have access to this page. Make sure the integration is connected to the page.' }, { status: 403 })
      }
      if (msg.includes('404')) {
        return NextResponse.json({ error: 'Page not found. Check the URL and ensure the integration has access.' }, { status: 404 })
      }
      throw err
    }

    const blocks = await fetchAllBlocks(id, notionKey)
    const markdown = `# ${pageInfo.title}\n\n${blocks.join('\n\n')}`

    return NextResponse.json({
      title: pageInfo.title,
      type: 'page',
      markdown,
      url: pageInfo.url || url,
    })
  } catch (err: any) {
    console.error('[studio/notion]', err)
    return NextResponse.json(
      { error: err?.message?.slice(0, 200) ?? 'Failed to fetch Notion content' },
      { status: 500 },
    )
  }
}
