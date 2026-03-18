import { redis } from './studio-db'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditAction =
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.signup'
  | 'auth.logout'
  | 'auth.magic_link.created'
  | 'auth.magic_link.consumed'
  | 'auth.rate_limited'
  | 'settings.updated'
  | 'settings.keys_changed'
  | 'admin.backfill'
  | 'share.created'
  | 'share.updated'
  | 'share.revoked'
  | 'presentation.created'
  | 'presentation.deleted'

interface AuditEntry {
  action: AuditAction
  userId?: string
  email?: string
  ip?: string
  metadata?: Record<string, unknown>
  timestamp: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const AUDIT_LOG_KEY = 'studio:audit:log'
const MAX_AUDIT_ENTRIES = 10_000 // Keep last 10k entries in Redis
const AUDIT_TTL_SECONDS = 90 * 24 * 60 * 60 // 90 days

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------

/**
 * Log a security-relevant event for SOC 2 compliance (CC7.2, CC7.3).
 * Writes to both structured console output (for log aggregation/SIEM)
 * and Redis sorted set (for in-app querying).
 */
export async function auditLog(
  action: AuditAction,
  opts: {
    userId?: string
    email?: string
    ip?: string
    metadata?: Record<string, unknown>
  } = {},
): Promise<void> {
  const entry: AuditEntry = {
    action,
    userId: opts.userId,
    email: opts.email,
    ip: opts.ip,
    metadata: opts.metadata,
    timestamp: new Date().toISOString(),
  }

  // Structured console log (picked up by Vercel/Datadog/etc.)
  console.log(JSON.stringify({ audit: true, ...entry }))

  // Persist to Redis (best-effort, don't block the request)
  try {
    const score = Date.now()
    await redis.zadd(AUDIT_LOG_KEY, {
      score,
      member: JSON.stringify(entry),
    })
    // Trim to keep bounded
    await redis.zremrangebyrank(AUDIT_LOG_KEY, 0, -(MAX_AUDIT_ENTRIES + 1))
  } catch (err) {
    // Never let audit logging break the request
    console.error('[audit] Failed to persist audit log:', err)
  }
}

/**
 * Extract IP from request headers (works behind Vercel/Cloudflare proxies).
 */
export function getRequestIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
