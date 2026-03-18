import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {
  createUser,
  getUserByEmail,
  createMagicLinkToken,
} from '@/lib/studio-db'
import { createToken, setAuthCookie } from '@/lib/studio-auth'
import { sendMagicLinkEmail } from '@/lib/studio-email'
import { authLimiter, checkRateLimit } from '@/lib/studio-ratelimit'
import { auditLog, getRequestIp } from '@/lib/studio-audit'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_EMAILS = new Set([
  'mcarignan@gmail.com',
  'al.cooney@gmail.com',
])

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getRequestIp(req.headers)
    const rateLimited = await checkRateLimit(authLimiter, ip)
    if (rateLimited) {
      await auditLog('auth.rate_limited', { ip })
      return rateLimited
    }

    const body = await req.json() as {
      action: 'login' | 'signup'
      email: string
      password: string
      name?: string
    }

    const { action, email, password, name } = body

    if (!email || !password || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // ── Signup ──────────────────────────────────────────────────────────
    if (action === 'signup') {
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 },
        )
      }

      if (!email.endsWith('@felixpago.com') && !ALLOWED_EMAILS.has(email.toLowerCase())) {
        return NextResponse.json(
          { error: 'Only @felixpago.com email addresses can sign up' },
          { status: 403 },
        )
      }

      if (password.length < 12) {
        return NextResponse.json(
          { error: 'Password must be at least 12 characters' },
          { status: 400 },
        )
      }

      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json(
          { error: 'Password must include uppercase, lowercase, and a number' },
          { status: 400 },
        )
      }

      const existing = await getUserByEmail(email)
      if (existing) {
        return NextResponse.json(
          { error: 'Unable to create account. Please check your details and try again.' },
          { status: 400 },
        )
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await createUser(email, name || email.split('@')[0], passwordHash)
      await auditLog('auth.signup', { userId: user.id, email, ip })

      // Auto-verify allowlisted and @felixpago.com users (skip email verification)
      if (ALLOWED_EMAILS.has(email.toLowerCase()) || email.endsWith('@felixpago.com')) {
        // Mark as verified and log them in directly
        const { verifyUser } = await import('@/lib/studio-db')
        await verifyUser(user.id)
        const token = await createToken(user.id)
        const res = NextResponse.json(
          { ok: true, user: { id: user.id, email: user.email, name: user.name } },
          { status: 201 },
        )
        setAuthCookie(res, token)
        return res
      }

      // Send magic link verification email for other users
      const magicToken = await createMagicLinkToken(user.id)
      const origin = req.nextUrl.origin
      await sendMagicLinkEmail(email, magicToken, origin)

      return NextResponse.json(
        { ok: true, pending: true, message: 'Check your email to verify your account.' },
        { status: 201 },
      )
    }

    // ── Login ───────────────────────────────────────────────────────────
    if (action === 'login') {
      const user = await getUserByEmail(email)
      if (!user) {
        await auditLog('auth.login.failed', { email, ip, metadata: { reason: 'user_not_found' } })
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 },
        )
      }

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) {
        await auditLog('auth.login.failed', { userId: user.id, email, ip, metadata: { reason: 'wrong_password' } })
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 },
        )
      }

      if (!user.verified) {
        // Auto-verify allowlisted and @felixpago.com users
        if (ALLOWED_EMAILS.has(email.toLowerCase()) || email.endsWith('@felixpago.com')) {
          const { verifyUser } = await import('@/lib/studio-db')
          await verifyUser(user.id)
        } else {
          // Resend verification email
          const magicToken = await createMagicLinkToken(user.id)
          const origin = req.nextUrl.origin
          await sendMagicLinkEmail(email, magicToken, origin)

          return NextResponse.json(
            { ok: true, pending: true, message: 'Your account is not verified. We sent a new verification link to your email.' },
          )
        }
      }

      const token = await createToken(user.id)
      await auditLog('auth.login.success', { userId: user.id, email, ip })
      const res = NextResponse.json({
        ok: true,
        user: { id: user.id, email: user.email, name: user.name },
      })
      setAuthCookie(res, token)
      return res
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('[studio/auth POST]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
