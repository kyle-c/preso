import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './studio-db'
import { NextResponse } from 'next/server'

/**
 * Auth rate limiter: 10 attempts per 15 minutes per IP.
 * Prevents brute-force login/signup attacks.
 */
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  prefix: 'rl:auth',
})

/**
 * Generation rate limiter: 30 requests per minute per user.
 * Prevents cost abuse via LLM API calls.
 */
export const generateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'rl:gen',
})

/**
 * General API rate limiter: 120 requests per minute per user.
 * Prevents abuse of CRUD endpoints.
 */
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, '1 m'),
  prefix: 'rl:api',
})

/**
 * Comment rate limiter: 30 writes per 15 minutes per IP.
 * Prevents spam/abuse on public comment endpoints.
 */
export const commentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '15 m'),
  prefix: 'rl:comment',
})

/** Check rate limit and return a 429 response if exceeded, or null if OK */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<NextResponse | null> {
  const { success, remaining, reset } = await limiter.limit(identifier)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    )
  }
  return null
}
