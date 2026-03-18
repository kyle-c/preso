import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserId } from '@/lib/studio-auth'
import { getUserSettings } from '@/lib/studio-db'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// ClickUp API helper — fetches tasks, lists, or spaces and converts to markdown
// ---------------------------------------------------------------------------

const CLICKUP_API = 'https://api.clickup.com/api/v2'

interface ClickupTask {
  id: string
  name: string
  description?: string
  status: { status: string; color: string }
  priority?: { priority: string } | null
  assignees: { username: string; profilePicture?: string }[]
  tags: { name: string }[]
  date_created: string
  date_updated: string
  due_date?: string | null
  start_date?: string | null
  time_estimate?: number | null
  custom_fields?: { name: string; type: string; value: any; type_config?: any }[]
  subtasks?: ClickupTask[]
  url: string
  list?: { name: string }
  folder?: { name: string }
  space?: { name: string }
  parent?: string | null
  points?: number | null
}

/** Format a ClickUp timestamp (ms) to readable date */
function formatDate(ms: string | number | null | undefined): string {
  if (!ms) return ''
  const d = new Date(typeof ms === 'string' ? parseInt(ms, 10) : ms)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Format milliseconds to hours/minutes */
function formatEstimate(ms: number | null | undefined): string {
  if (!ms) return ''
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

/** Convert custom field value to display string */
function customFieldToString(field: { name: string; type: string; value: any; type_config?: any }): string {
  if (field.value === null || field.value === undefined) return ''
  switch (field.type) {
    case 'drop_down':
    case 'labels': {
      const opts = field.type_config?.options ?? []
      if (Array.isArray(field.value)) {
        return field.value.map((idx: number) => opts[idx]?.name ?? `#${idx}`).join(', ')
      }
      const opt = opts.find((o: any) => o.orderindex === field.value)
      return opt?.name ?? String(field.value)
    }
    case 'number':
    case 'currency':
    case 'percentage':
      return String(field.value)
    case 'date':
      return formatDate(field.value)
    case 'text':
    case 'short_text':
    case 'email':
    case 'phone':
    case 'url':
      return String(field.value)
    case 'checkbox':
      return field.value ? '✓' : '✗'
    case 'users':
      return Array.isArray(field.value)
        ? field.value.map((u: any) => u.username ?? 'Unknown').join(', ')
        : String(field.value)
    default:
      return typeof field.value === 'object' ? JSON.stringify(field.value) : String(field.value)
  }
}

/** Convert a single task to markdown */
function taskToMarkdown(task: ClickupTask, depth = 0): string {
  const indent = '  '.repeat(depth)
  const lines: string[] = []

  // Task header
  const status = task.status?.status ?? 'unknown'
  const priority = task.priority?.priority ?? ''
  const assignees = task.assignees?.map(a => a.username).join(', ') || 'Unassigned'

  if (depth === 0) {
    lines.push(`# ${task.name}`)
    lines.push('')
    lines.push(`| Field | Value |`)
    lines.push(`| --- | --- |`)
    lines.push(`| Status | ${status} |`)
    if (priority) lines.push(`| Priority | ${priority} |`)
    lines.push(`| Assignees | ${assignees} |`)
    if (task.tags.length > 0) lines.push(`| Tags | ${task.tags.map(t => t.name).join(', ')} |`)
    if (task.due_date) lines.push(`| Due Date | ${formatDate(task.due_date)} |`)
    if (task.start_date) lines.push(`| Start Date | ${formatDate(task.start_date)} |`)
    if (task.time_estimate) lines.push(`| Time Estimate | ${formatEstimate(task.time_estimate)} |`)
    if (task.points != null) lines.push(`| Points | ${task.points} |`)
    if (task.list?.name) lines.push(`| List | ${task.list.name} |`)
    if (task.folder?.name) lines.push(`| Folder | ${task.folder.name} |`)
    if (task.space?.name) lines.push(`| Space | ${task.space.name} |`)
    lines.push(`| Created | ${formatDate(task.date_created)} |`)
    lines.push(`| Updated | ${formatDate(task.date_updated)} |`)
    lines.push('')
  } else {
    const statusBadge = `[${status}]`
    lines.push(`${indent}- **${task.name}** ${statusBadge} — ${assignees}${task.due_date ? ` (due ${formatDate(task.due_date)})` : ''}`)
  }

  // Description
  if (task.description && depth === 0) {
    lines.push('## Description')
    lines.push('')
    lines.push(task.description)
    lines.push('')
  }

  // Custom fields
  if (task.custom_fields && task.custom_fields.length > 0 && depth === 0) {
    const nonEmpty = task.custom_fields.filter(f => {
      const val = customFieldToString(f)
      return val !== '' && val !== 'false'
    })
    if (nonEmpty.length > 0) {
      lines.push('## Custom Fields')
      lines.push('')
      lines.push('| Field | Value |')
      lines.push('| --- | --- |')
      for (const f of nonEmpty) {
        lines.push(`| ${f.name} | ${customFieldToString(f)} |`)
      }
      lines.push('')
    }
  }

  // Subtasks
  if (task.subtasks && task.subtasks.length > 0) {
    if (depth === 0) {
      lines.push('## Subtasks')
      lines.push('')
    }
    for (const sub of task.subtasks) {
      lines.push(taskToMarkdown(sub, depth + 1))
    }
    if (depth === 0) lines.push('')
  }

  return lines.join('\n')
}

/** Convert a list of tasks to markdown */
function tasksToMarkdown(tasks: ClickupTask[], listName: string): string {
  const lines: string[] = [`# ${listName}`, '', `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`, '']

  // Group by status
  const byStatus = new Map<string, ClickupTask[]>()
  for (const t of tasks) {
    const s = t.status?.status ?? 'unknown'
    const arr = byStatus.get(s) ?? []
    arr.push(t)
    byStatus.set(s, arr)
  }

  // Summary table
  lines.push('| Task | Status | Priority | Assignee | Due |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const t of tasks) {
    const assignee = t.assignees?.[0]?.username ?? '—'
    const priority = t.priority?.priority ?? '—'
    const due = t.due_date ? formatDate(t.due_date) : '—'
    lines.push(`| ${t.name} | ${t.status?.status ?? '—'} | ${priority} | ${assignee} | ${due} |`)
  }
  lines.push('')

  // Detailed sections by status
  for (const [status, statusTasks] of byStatus) {
    lines.push(`## ${status} (${statusTasks.length})`)
    lines.push('')
    for (const t of statusTasks) {
      const assignee = t.assignees?.[0]?.username ?? 'Unassigned'
      const priority = t.priority?.priority ? ` [${t.priority.priority}]` : ''
      const due = t.due_date ? ` — due ${formatDate(t.due_date)}` : ''
      lines.push(`- **${t.name}**${priority} — ${assignee}${due}`)
      if (t.description) {
        const desc = t.description.split('\n')[0].slice(0, 120)
        lines.push(`  ${desc}${t.description.length > 120 ? '...' : ''}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Parse ClickUp URL to extract type and ID
// ---------------------------------------------------------------------------

interface ParsedClickUp {
  type: 'task' | 'list' | 'folder' | 'space'
  id: string
}

function parseClickUpUrl(input: string): ParsedClickUp | null {
  const trimmed = input.trim()

  // Raw task ID (alphanumeric, typically 7-9 chars like "abc1234")
  if (/^[a-z0-9]{5,12}$/i.test(trimmed)) {
    return { type: 'task', id: trimmed }
  }

  // Numeric ID (list or space)
  if (/^\d+$/.test(trimmed)) {
    return { type: 'list', id: trimmed }
  }

  try {
    const url = new URL(trimmed)
    if (!url.hostname.includes('clickup.com')) return null

    const path = url.pathname

    // Task URL: /t/TASK_ID or /t/WORKSPACE_ID/TASK_ID
    const taskMatch = path.match(/\/t\/(?:[^/]+\/)?([a-z0-9]+)$/i)
    if (taskMatch) return { type: 'task', id: taskMatch[1] }

    // List URL: /LIST_ID/v/li/LIST_NUM or similar
    const listMatch = path.match(/\/(\d+)\/v\//)
    if (listMatch) return { type: 'list', id: listMatch[1] }

    // Space/folder from path: various formats
    const spaceMatch = path.match(/\/(\d+)(?:\/|$)/)
    if (spaceMatch) return { type: 'list', id: spaceMatch[1] }

  } catch {
    // Not a URL
  }

  return null
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { url, type: requestType } = body as {
      url?: string
      type?: 'task' | 'list'
    }

    if (!url) {
      return NextResponse.json({ error: 'ClickUp URL or task ID is required' }, { status: 400 })
    }

    const settings = await getUserSettings(userId)
    const clickupKey = settings.clickupKey
    if (!clickupKey) {
      return NextResponse.json({ error: 'ClickUp API token is required. Add it in Settings → Integrations.' }, { status: 400 })
    }

    const headers = {
      'Authorization': clickupKey,
      'Content-Type': 'application/json',
    }

    const parsed = parseClickUpUrl(url)
    if (!parsed) {
      return NextResponse.json({ error: 'Could not parse ClickUp URL. Use a task or list URL from app.clickup.com.' }, { status: 400 })
    }

    const resolvedType = requestType || parsed.type

    if (resolvedType === 'task') {
      // Fetch single task with subtasks
      const taskRes = await fetch(`${CLICKUP_API}/task/${parsed.id}?include_subtasks=true&custom_fields=true`, { headers })

      if (!taskRes.ok) {
        const status = taskRes.status
        if (status === 401) return NextResponse.json({ error: 'Invalid ClickUp API token. Check Settings → Integrations.' }, { status: 401 })
        if (status === 404) return NextResponse.json({ error: 'Task not found. Check the URL or task ID.' }, { status: 404 })
        const errText = await taskRes.text().catch(() => '')
        return NextResponse.json({ error: `ClickUp API error ${status}: ${errText.slice(0, 200)}` }, { status: 502 })
      }

      const task: ClickupTask = await taskRes.json()

      // Also fetch comments
      let commentsMarkdown = ''
      try {
        const commentsRes = await fetch(`${CLICKUP_API}/task/${parsed.id}/comment`, { headers })
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          const comments = commentsData.comments ?? []
          if (comments.length > 0) {
            commentsMarkdown = '\n## Comments\n\n' + comments.map((c: any) => {
              const author = c.user?.username ?? 'Unknown'
              const date = formatDate(c.date)
              const text = c.comment_text ?? ''
              return `**${author}** (${date}):\n${text}`
            }).join('\n\n')
          }
        }
      } catch { /* comments are optional */ }

      const markdown = taskToMarkdown(task) + commentsMarkdown

      return NextResponse.json({
        title: task.name,
        type: 'task',
        markdown,
        url: task.url,
      })
    }

    // Fetch list tasks
    const listRes = await fetch(`${CLICKUP_API}/list/${parsed.id}/task?include_closed=true&subtasks=true&custom_fields=true`, { headers })

    if (!listRes.ok) {
      const status = listRes.status
      if (status === 401) return NextResponse.json({ error: 'Invalid ClickUp API token. Check Settings → Integrations.' }, { status: 401 })
      if (status === 404) return NextResponse.json({ error: 'List not found. Check the URL or list ID.' }, { status: 404 })
      const errText = await listRes.text().catch(() => '')
      return NextResponse.json({ error: `ClickUp API error ${status}: ${errText.slice(0, 200)}` }, { status: 502 })
    }

    const listData = await listRes.json()
    const tasks: ClickupTask[] = listData.tasks ?? []

    // Get list name
    let listName = 'ClickUp List'
    try {
      const listInfoRes = await fetch(`${CLICKUP_API}/list/${parsed.id}`, { headers })
      if (listInfoRes.ok) {
        const listInfo = await listInfoRes.json()
        listName = listInfo.name ?? listName
      }
    } catch { /* fallback to generic name */ }

    const markdown = tasksToMarkdown(tasks, listName)

    return NextResponse.json({
      title: listName,
      type: 'list',
      markdown,
      url: `https://app.clickup.com/${parsed.id}`,
    })
  } catch (err: any) {
    console.error('[studio/clickup]', err)
    return NextResponse.json(
      { error: err?.message?.slice(0, 200) ?? 'Failed to fetch ClickUp content' },
      { status: 500 },
    )
  }
}
