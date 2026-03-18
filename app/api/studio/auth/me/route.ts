import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession, clearAuthCookie, revokeToken } from '@/lib/studio-auth'
import { auditLog } from '@/lib/studio-audit'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { user } = session
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (err) {
    console.error('[studio/auth/me GET]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    // Revoke the current token so it can't be reused
    const cookieStore = await cookies()
    const token = cookieStore.get('studio-auth')?.value
    if (token) {
      await revokeToken(token)
    }
    const session = await getServerSession()
    if (session) {
      await auditLog('auth.logout', { userId: session.userId, email: session.user.email })
    }
    const res = NextResponse.json({ ok: true })
    clearAuthCookie(res)
    return res
  } catch (err) {
    console.error('[studio/auth/me DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
