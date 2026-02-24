import { NextResponse } from 'next/server'
import { content, languages } from '@/app/fintechtestflow/content'

export const dynamic = 'force-dynamic'

function row(key: string, en: string, esmx: string, ptbr: string) {
  return `| \`${key}\` | ${en} | ${esmx} | ${ptbr} |`
}

function section(label: string, key: keyof typeof content['en']) {
  const tokens = content['en'][key] as Record<string, string>
  const lines = [
    `## ${label} — \`${key}\``,
    '',
    '| Token | 🇺🇸 English | 🇲🇽 Español (MX) | 🇧🇷 Português (BR) |',
    '|-------|------------|-----------------|-------------------|',
    ...Object.keys(tokens).map(k =>
      row(
        k,
        (content['en'][key] as Record<string, string>)[k],
        (content['es-mx'][key] as Record<string, string>)[k],
        (content['pt-br'][key] as Record<string, string>)[k],
      )
    ),
    '',
  ]
  return lines.join('\n')
}

const markdown = [
  `# Felix Pago — /fintechtestflow Content Tokens`,
  ``,
  `> All user-facing strings for the payment flow, organized by screen.`,
  `> Live token table: https://felix-design.vercel.app/fintech/tokens`,
  `> Flow prototype:   https://felix-design.vercel.app/fintechtestflow`,
  ``,
  `Languages: ${languages.map(l => `${l.flag} ${l.label} (\`${l.code}\`)`).join(' · ')}`,
  ``,
  `---`,
  ``,
  `## Interpolation`,
  ``,
  `Some tokens contain a \`{placeholder}\` that must be replaced at runtime:`,
  ``,
  `| Token | Placeholder | Example |`,
  `|-------|-------------|---------|`,
  `| \`review.storeFee\` | \`{store}\` | "Walgreens fee" |`,
  ``,
  `---`,
  ``,
  section('Common', 'common'),
  section('Payment Method', 'paymentMethod'),
  section('Address', 'address'),
  section('Card Details', 'cardDetails'),
  section('Store Selection', 'storeSelection'),
  section('Review', 'review'),
  section('Success', 'success'),
  `---`,
  ``,
  `Felix Pago Design System · Content tokens for /fintechtestflow`,
].join('\n')

export async function GET() {
  return new NextResponse(markdown, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
