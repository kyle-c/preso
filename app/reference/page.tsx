'use client'

import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { referenceMarkdown } from '@/lib/reference-markdown'

/* ── Slugify ────────────────────────────────────────────────────────────────── */

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/* ── Markdown → HTML with explicit design-system classes ────────────────────── */

function renderMarkdown(md: string): string {
  let html = md

  // Fenced code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trimEnd()
    return `<pre class="my-4 overflow-x-auto rounded-xl border border-border bg-slate p-5 text-[13px] leading-relaxed text-linen font-mono"><code>${escaped}</code></pre>`
  })

  // Inline code — must be after fenced blocks
  html = html.replace(/`([^`]+)`/g,
    '<code class="rounded-md border border-slate/10 bg-stone px-1.5 py-0.5 text-[13px] font-mono text-foreground">$1</code>')

  // Tables
  html = html.replace(
    /(?:^|\n)((?:\|[^\n]+\|\n)+)/g,
    (_m, tableBlock: string) => {
      const rows = tableBlock.trim().split('\n')
      if (rows.length < 2) return tableBlock

      const parseRow = (r: string) =>
        r.split('|').slice(1, -1).map(c => c.trim())

      const headers = parseRow(rows[0])
      const bodyRows = rows.slice(2) // skip separator row

      let t = '<div class="my-4 overflow-hidden rounded-xl border border-border">'
      t += '<table class="w-full border-collapse text-sm">'
      t += '<thead><tr class="bg-stone">'
      headers.forEach(h => {
        t += `<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">${h}</th>`
      })
      t += '</tr></thead><tbody class="divide-y divide-border">'
      bodyRows.forEach(r => {
        const cells = parseRow(r)
        t += '<tr class="transition-colors hover:bg-stone/40">'
        cells.forEach(c => {
          t += `<td class="px-4 py-2.5 text-sm text-muted-foreground">${c}</td>`
        })
        t += '</tr>'
      })
      t += '</tbody></table></div>'
      return '\n' + t + '\n'
    },
  )

  // H4
  html = html.replace(/^#### (.+)$/gm,
    '<h4 class="mt-8 mb-3 font-display text-base font-bold text-foreground">$1</h4>')

  // H3
  html = html.replace(/^### (.+)$/gm,
    '<h3 class="mt-10 mb-4 font-display text-lg font-bold text-foreground">$1</h3>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-border" />')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm,
    '<blockquote class="my-4 border-l-4 border-turquoise pl-4 text-sm text-muted-foreground leading-relaxed">$1</blockquote>')
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote class="[^"]*">/g, '<br />')

  // Ordered lists (1. 2. 3.)
  html = html.replace(/(?:^|\n)((?:\d+\. [^\n]+\n?)+)/g, (_m, block: string) => {
    const items = block.trim().split('\n').map(l => l.replace(/^\d+\.\s/, ''))
    return '\n<ol class="my-3 ml-4 list-decimal space-y-2 text-sm text-muted-foreground leading-relaxed marker:text-foreground marker:font-semibold">' +
      items.map(i => `<li class="pl-1">${i}</li>`).join('') + '</ol>\n'
  })

  // Unordered lists
  html = html.replace(/(?:^|\n)((?:- [^\n]+\n?)+)/g, (_m, block: string) => {
    const items = block.trim().split('\n').map(l => l.replace(/^- /, ''))
    return '\n<ul class="my-3 ml-4 list-disc space-y-1.5 text-sm text-muted-foreground leading-relaxed marker:text-concrete">' +
      items.map(i => `<li class="pl-1">${i}</li>`).join('') + '</ul>\n'
  })

  // Paragraphs — wrap remaining loose text
  html = html
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('<') || trimmed.startsWith('#')) return trimmed
      return `<p class="my-3 text-sm leading-relaxed text-muted-foreground">${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n\n')

  return html
}

/* ── Section renderer ───────────────────────────────────────────────────────── */

function MarkdownSection({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div
        className="max-w-4xl"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function ReferencePage() {
  const lines = referenceMarkdown.split('\n')
  const sections: { title: string; body: string }[] = []
  let preamble = ''
  let currentTitle = ''
  let currentBody: string[] = []

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/)
    if (h2Match) {
      if (currentTitle) {
        sections.push({ title: currentTitle, body: currentBody.join('\n') })
      } else if (currentBody.length) {
        preamble = currentBody.join('\n')
      }
      currentTitle = h2Match[1]
      currentBody = []
    } else {
      currentBody.push(line)
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, body: currentBody.join('\n') })
  }

  return (
    <DesignSystemLayout
      title="Reference"
      description="Comprehensive design system reference — everything needed to replicate every screen, component, and pattern."
    >
      {/* Preamble */}
      {preamble && (
        <div
          className="mb-10 max-w-4xl"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(preamble) }}
        />
      )}

      {/* Table of contents */}
      <nav className="mb-14 overflow-hidden rounded-xl border border-border bg-stone/50">
        <div className="border-b border-border bg-stone px-6 py-3">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
            Contents
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0 px-6 py-4">
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#${slugify(s.title)}`}
              className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-turquoise flex-shrink-0" />
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      {sections.map((s) => (
        <MarkdownSection
          key={s.title}
          id={slugify(s.title)}
          title={s.title}
          body={s.body}
        />
      ))}

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-8 pb-4">
        <p className="text-xs text-muted-foreground">
          Felix Pago Design System — Comprehensive Reference
        </p>
      </div>
    </DesignSystemLayout>
  )
}
