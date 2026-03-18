import { NextResponse } from 'next/server'
import { redis } from '@/lib/studio-db'
import type { ShareRecord } from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'
import { auditLog } from '@/lib/studio-audit'

export const runtime = 'nodejs'

const sharedWithKey = (email: string) => `studio:shared-with:${email.toLowerCase()}`
const sharedOrgKey = () => `studio:shared-org`

/**
 * One-time backfill: scan existing share records and populate inverse indexes.
 * POST /api/studio/admin/backfill-shares
 */
export async function POST() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Only allow admin users to run backfill operations
    const ADMIN_EMAILS = new Set(['kyle.cooney@felixpago.com'])
    if (!ADMIN_EMAILS.has(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Scan all share keys
    let cursor = 0
    let processed = 0
    let indexed = 0

    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: 'studio:share:*',
        count: 100,
      })
      cursor = typeof nextCursor === 'string' ? parseInt(nextCursor, 10) : nextCursor

      for (const key of keys) {
        const raw = await redis.get<string | ShareRecord>(key)
        if (!raw) continue
        processed++

        // Skip bare string (legacy presId-only entries)
        if (typeof raw === 'string') continue

        const record = raw as ShareRecord
        if (!record.presentationId) continue

        const ops: Promise<any>[] = []

        if (record.access === 'org') {
          ops.push(redis.zadd(sharedOrgKey(), { score: record.createdAt || 0, member: record.presentationId }))
        }

        for (const email of record.allowedEmails ?? []) {
          ops.push(redis.zadd(sharedWithKey(email), { score: record.createdAt || 0, member: record.presentationId }))
        }

        if (ops.length > 0) {
          await Promise.all(ops)
          indexed++
        }
      }
    } while (cursor !== 0)

    await auditLog('admin.backfill', { userId: session.userId, email: session.user.email, metadata: { processed, indexed } })

    return NextResponse.json({
      success: true,
      processed,
      indexed,
    })
  } catch (err) {
    console.error('[admin/backfill-shares]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
