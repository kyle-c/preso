import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.SITE_PASSWORD || 'felix2026'
const COOKIE_NAME = 'site-auth'

const PUBLIC_ROUTES = new Set([
  '/',
  '/colors',
  '/components',
  '/components-next',
  '/typography',
  '/tokens',
  '/illustrations',
  '/iconography',
  '/principles',
  '/editorial-guidelines',
  '/buttonexplorations',
])

function isPublic(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true
  if (pathname === '/auth') return true
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon') || pathname.startsWith('/illustrations/') || pathname.startsWith('/team/')) return true
  return false
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  // Check auth cookie
  if (req.cookies.get(COOKIE_NAME)?.value === PASSWORD) return NextResponse.next()

  // Check if this is a password submission
  if (pathname === '/auth' && req.method === 'POST') {
    return NextResponse.next()
  }

  // Redirect to login
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.png|illustrations/.*|team/.*).*)'],
}
