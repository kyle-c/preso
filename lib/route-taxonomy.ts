export const PRODUCT_ROUTES = [
  '/',
  '/presentations',
] as const

export const DESIGN_SYSTEM_ROUTES = [
  '/design-system',
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
  '/md',
  '/fintech/tokens',
] as const

export const PRESENTATION_ROUTES = [
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
  '/felix-surface',
  '/design-roadmap',
  '/design-roadmap-v2',
  '/design-uxr-qbr',
  '/fintechtestflow',
  '/multisurface',
  '/qbr-cord',
  '/kyc-explorations',
  '/icp',
  '/icp-summary',
  '/icp-summary/exec',
  '/cd-summary',
  '/omnipresent',
  '/wallet',
] as const

export const AUTH_FREE_PREFIXES = [
  '/_next',
  '/api',
  '/create',
  '/s/',
] as const

const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|eot|css|js|json|map|txt|xml|webmanifest)$/i

export const PUBLIC_ROUTE_SET = new Set<string>([
  ...PRODUCT_ROUTES,
  ...DESIGN_SYSTEM_ROUTES,
  ...PRESENTATION_ROUTES,
])

export function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTE_SET.has(pathname)) return true
  if (pathname === '/auth') return true
  if (STATIC_EXT.test(pathname)) return true
  if (pathname.endsWith('/embed') || pathname.includes('/embed/')) return true
  return AUTH_FREE_PREFIXES.some(prefix => pathname.startsWith(prefix))
}
