import { NextRequest, NextResponse } from 'next/server'
import { isPublicRoute } from '@/lib/route-taxonomy'

const COOKIE_NAME = 'site-auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicRoute(pathname)) return NextResponse.next()

  const password = process.env.SITE_PASSWORD
  if (!password) {
    return new NextResponse('SITE_PASSWORD environment variable is required', { status: 500 })
  }

  // Check auth cookie
  if (req.cookies.get(COOKIE_NAME)?.value === password) return NextResponse.next()

  // Redirect to login
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
