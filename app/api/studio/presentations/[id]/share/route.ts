import { NextRequest, NextResponse } from 'next/server'
import {
  getPresentation,
  generateShareToken,
  getShareConfigForPresentation,
  updateShareAccess,
  revokeShare,
  type ShareAccess,
  type SharePermission,
} from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'
import { shareSchema } from '@/lib/studio-schemas'
import { auditLog } from '@/lib/studio-audit'

export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string }> }

// GET — Fetch current share config for a presentation
export async function GET(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const presentation = await getPresentation(id)

    if (!presentation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (presentation.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const config = await getShareConfigForPresentation(id)
    if (!config) {
      return NextResponse.json({ shared: false })
    }

    return NextResponse.json({
      shared: true,
      shareToken: config.token,
      url: `/s/${config.token}`,
      access: config.record.access,
      allowedEmails: config.record.allowedEmails,
      permission: config.record.permission,
      emailPermissions: config.record.emailPermissions,
    })
  } catch (err) {
    console.error('[studio/presentations/[id]/share GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — Create or update share link
export async function POST(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const presentation = await getPresentation(id)

    if (!presentation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (presentation.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse body — support both old (no body) and new (with access config) formats
    let access: ShareAccess = 'public'
    let allowedEmails: string[] = []
    let permission: SharePermission = 'viewer'
    let emailPermissions: Record<string, SharePermission> | undefined

    try {
      const raw = await req.json()
      const parsed = shareSchema.safeParse(raw)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
          { status: 400 },
        )
      }
      if (parsed.data.access) access = parsed.data.access
      if (parsed.data.allowedEmails) allowedEmails = parsed.data.allowedEmails
      if (parsed.data.permission) permission = parsed.data.permission
      if (parsed.data.emailPermissions) emailPermissions = parsed.data.emailPermissions
    } catch {
      // No body — default to public (backward compatible)
    }

    // If share token already exists, update access in place
    const existing = await getShareConfigForPresentation(id)
    if (existing) {
      const updated = await updateShareAccess(existing.token, access, allowedEmails, permission, emailPermissions)
      await auditLog('share.updated', { userId: session.userId, metadata: { presentationId: id, access, emailCount: allowedEmails.length } })
      return NextResponse.json({
        shareToken: existing.token,
        url: `/s/${existing.token}`,
        access: updated?.access ?? access,
        allowedEmails: updated?.allowedEmails ?? allowedEmails,
        permission: updated?.permission ?? permission,
        emailPermissions: updated?.emailPermissions ?? emailPermissions,
      })
    }

    // Generate new token
    const shareToken = await generateShareToken(id, session.userId, access, allowedEmails, permission, emailPermissions)
    if (!shareToken) {
      return NextResponse.json(
        { error: 'Failed to generate share token' },
        { status: 500 },
      )
    }

    await auditLog('share.created', { userId: session.userId, metadata: { presentationId: id, access, emailCount: allowedEmails.length } })

    return NextResponse.json({
      shareToken,
      url: `/s/${shareToken}`,
      access,
      allowedEmails,
      permission,
      emailPermissions,
    })
  } catch (err) {
    console.error('[studio/presentations/[id]/share POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — Revoke sharing
export async function DELETE(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const presentation = await getPresentation(id)

    if (!presentation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (presentation.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await revokeShare(id)
    await auditLog('share.revoked', { userId: session.userId, metadata: { presentationId: id } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[studio/presentations/[id]/share DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
