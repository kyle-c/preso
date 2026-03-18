/* ──────────────────────────────────────────────────────────
   Upstash Redis REST client for deck comments
   Env vars required:
     UPSTASH_REDIS_REST_URL   – e.g. https://us1-abc.upstash.io
     UPSTASH_REDIS_REST_TOKEN – the Bearer token from Upstash console
────────────────────────────────────────────────────────── */

export interface Reply {
  id: string
  name: string
  text: string
  timestamp: number
}

export interface Comment {
  id: string
  deckId: string
  slideIndex: number
  x: number          // 0–100 percentage
  y: number          // 0–100 percentage
  name: string
  email?: string
  text: string
  timestamp: number
  replies: Reply[]
  flaggedForRebuild?: boolean
  resolved?: boolean
  resolvedAt?: number
  resolvedBy?: string
}

function redisUrl() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash env vars not set: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN')
  return { url, token }
}

async function redisCmd(...args: (string | number)[]): Promise<unknown> {
  const { url, token } = redisUrl()
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const data = await res.json() as { result: unknown }
  return data.result
}

const key = (deckId: string) => `comments:${deckId}`

export async function getComments(deckId: string): Promise<Comment[]> {
  const raw = await redisCmd('GET', key(deckId)) as string | null
  if (!raw) return []
  try { return JSON.parse(raw) as Comment[] } catch { return [] }
}

/** Get comment counts for multiple decks in parallel */
export async function getCommentCounts(deckIds: string[]): Promise<Record<string, number>> {
  if (deckIds.length === 0) return {}
  const results = await Promise.all(
    deckIds.map(async (id) => {
      const comments = await getComments(id)
      const active = comments.filter(c => !c.resolved)
      return [id, active.length] as const
    })
  )
  return Object.fromEntries(results)
}

export async function setComments(deckId: string, comments: Comment[]): Promise<void> {
  await redisCmd('SET', key(deckId), JSON.stringify(comments))
}

export async function addComment(deckId: string, comment: Omit<Comment, 'id' | 'deckId' | 'timestamp' | 'replies'>): Promise<Comment> {
  const comments = await getComments(deckId)
  const next: Comment = {
    ...comment,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    deckId,
    timestamp: Date.now(),
    replies: [],
    flaggedForRebuild: false,
  }
  await setComments(deckId, [...comments, next])
  return next
}

export async function updateComment(deckId: string, id: string, patch: Partial<Pick<Comment, 'text' | 'flaggedForRebuild' | 'resolved' | 'resolvedAt' | 'resolvedBy'>>): Promise<Comment | null> {
  const comments = await getComments(deckId)
  const idx = comments.findIndex(c => c.id === id)
  if (idx === -1) return null
  const updated = { ...comments[idx], ...patch }
  comments[idx] = updated
  await setComments(deckId, comments)
  return updated
}

export async function deleteComment(deckId: string, id: string): Promise<void> {
  const comments = await getComments(deckId)
  await setComments(deckId, comments.filter(c => c.id !== id))
}

export async function addReply(deckId: string, commentId: string, reply: Omit<Reply, 'id' | 'timestamp'>): Promise<void> {
  const comments = await getComments(deckId)
  const idx = comments.findIndex(c => c.id === commentId)
  if (idx === -1) return
  const newReply: Reply = { ...reply, id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now() }
  comments[idx] = { ...comments[idx], replies: [...comments[idx].replies, newReply] }
  await setComments(deckId, comments)
}

export async function deleteReply(deckId: string, commentId: string, replyId: string): Promise<void> {
  const comments = await getComments(deckId)
  const idx = comments.findIndex(c => c.id === commentId)
  if (idx === -1) return
  comments[idx] = { ...comments[idx], replies: comments[idx].replies.filter(r => r.id !== replyId) }
  await setComments(deckId, comments)
}

export async function getFlaggedAsMarkdown(deckId: string): Promise<string> {
  const comments = await getComments(deckId)
  const flagged = comments.filter(c => c.flaggedForRebuild)
  if (flagged.length === 0) return `# No flagged comments for deck: ${deckId}\n`

  const lines = [
    `# Flagged Comments for Rebuild — ${deckId}`,
    `Generated: ${new Date().toISOString()}`,
    `Total flagged: ${flagged.length}`,
    '',
    '---',
    '',
  ]

  for (const c of flagged) {
    lines.push(`## Slide ${c.slideIndex + 1} — Comment by ${c.name}${c.email ? ` (${c.email})` : ''}`)
    lines.push('')
    lines.push(`> ${c.text}`)
    lines.push('')
    if (c.replies.length > 0) {
      lines.push('**Replies:**')
      for (const r of c.replies) {
        lines.push(`- **${r.name}**: ${r.text}`)
      }
      lines.push('')
    }
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}
