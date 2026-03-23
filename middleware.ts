import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.SITE_PASSWORD
if (!PASSWORD) {
  throw new Error('SITE_PASSWORD environment variable is required')
}
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
  '/presentations',
  '/design-system-preso',
  '/preso-sample',
  '/jose',
  '/platform-announcement',
  '/consumer-payments',
  '/design-org',
  '/content-design',
  '/content-design-lead',
  '/giselle-presentation',
  '/felix-investor',
  '/design-roadmap',
  '/design-roadmap-v2',
  '/fintechtestflow',
  '/multisurface',
  '/qbr-cord',
  '/md',
  '/kyc-explorations',
])

const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|eot|css|js|json|map|txt|xml|webmanifest)$/i

function isPublic(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true
  if (pathname === '/auth') return true
  if (STATIC_EXT.test(pathname)) return true
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return true
  if (pathname.startsWith('/create')) return true
  if (pathname.startsWith('/s/')) return true
  if (pathname.endsWith('/embed') || pathname.includes('/embed/')) return true
  return false
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

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
