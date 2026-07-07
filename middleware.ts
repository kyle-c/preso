import { NextRequest, NextResponse } from 'next/server'
import { isPublicRoute } from '@/lib/route-taxonomy'

const PASSWORD = process.env.SITE_PASSWORD
if (!PASSWORD) {
  throw new Error('SITE_PASSWORD environment variable is required')
}
const COOKIE_NAME = 'site-auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicRoute(pathname)) return NextResponse.next()

  // Check auth cookie
  if (req.cookies.get(COOKIE_NAME)?.value === PASSWORD) return NextResponse.next()

  // Redirect to login
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
