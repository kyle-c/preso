import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { getUserById, redis } from './studio-db'
import type { User } from './studio-db'
import crypto from 'crypto'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const COOKIE_NAME = 'studio-auth'
const TOKEN_EXPIRY = '7d'
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60
const BLACKLIST_PREFIX = 'studio:token:revoked:'

function getSecret(): Uint8Array {
  const raw = process.env.STUDIO_JWT_SECRET
  if (!raw) {
    throw new Error('STUDIO_JWT_SECRET environment variable is required')
  }
  return new TextEncoder().encode(raw)
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export async function createToken(userId: string): Promise<string> {
  const jti = crypto.randomUUID()
  return new SignJWT({ sub: userId, jti })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.sub !== 'string') return null
    // Check if token has been revoked
    if (payload.jti) {
      const revoked = await redis.get(`${BLACKLIST_PREFIX}${payload.jti}`)
      if (revoked) return null
    }
    return { userId: payload.sub }
  } catch {
    return null
  }
}

/**
 * Revoke a token by adding its jti to the blacklist.
 * The blacklist entry auto-expires when the token would have expired.
 */
export async function revokeToken(token: string): Promise<void> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.jti) {
      await redis.set(`${BLACKLIST_PREFIX}${payload.jti}`, '1', { ex: TOKEN_EXPIRY_SECONDS })
    }
  } catch {
    // Token already invalid — nothing to revoke
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

export async function getSessionUserId(
  cookieStore: RequestCookies | ReadonlyRequestCookies,
): Promise<string | null> {
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie?.value) return null
  const result = await verifyToken(cookie.value)
  return result?.userId ?? null
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  })
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

// ---------------------------------------------------------------------------
// Server component helper
// ---------------------------------------------------------------------------

export async function getServerSession(): Promise<{
  userId: string
  user: User
} | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie?.value) return null

  const result = await verifyToken(cookie.value)
  if (!result) return null

  const user = await getUserById(result.userId)
  if (!user) return null

  return { userId: result.userId, user }
}
