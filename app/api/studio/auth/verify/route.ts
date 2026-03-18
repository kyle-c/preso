import { NextRequest, NextResponse } from 'next/server'
import { consumeMagicLinkToken, verifyUser } from '@/lib/studio-db'
import { createToken, setAuthCookie } from '@/lib/studio-auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json() as { token: string }

    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 },
      )
    }

    const userId = await consumeMagicLinkToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link. Please sign up again.' },
        { status: 400 },
      )
    }

    const verified = await verifyUser(userId)
    if (!verified) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // Log them in
    const authToken = await createToken(userId)
    const res = NextResponse.json({ ok: true })
    setAuthCookie(res, authToken)
    return res
  } catch (err) {
    console.error('[studio/auth/verify POST]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
