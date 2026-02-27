'use client'

import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { referenceMarkdown } from '@/lib/reference-markdown'

/**
 * Splits the reference markdown into sections by ## headings,
 * then renders each as a styled prose block.
 */
function MarkdownSection({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      <div
        className="prose prose-slate max-w-none
          prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight
          prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
          prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2
          prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted-foreground
          prose-li:text-[15px] prose-li:text-muted-foreground
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-[13px] prose-code:bg-stone prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate prose-pre:text-linen prose-pre:rounded-xl prose-pre:text-[13px] prose-pre:leading-relaxed
          prose-table:text-[14px]
          prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:border-b prose-th:border-border prose-th:pb-2
          prose-td:border-b prose-td:border-border/50 prose-td:py-2 prose-td:text-muted-foreground
          prose-a:text-turquoise-700 prose-a:underline prose-a:underline-offset-2
          prose-blockquote:border-turquoise prose-blockquote:text-muted-foreground prose-blockquote:not-italic
          prose-hr:border-border
        "
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </section>
  )
}

/** Minimal markdown → HTML renderer (no external deps). */
function renderMarkdown(md: string): string {
  let html = md

  // Fenced code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trimEnd()
    return `<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Tables
  html = html.replace(
    /(?:^|\n)((?:\|[^\n]+\|\n)+)/g,
    (_m, tableBlock: string) => {
      const rows = tableBlock.trim().split('\n')
      if (rows.length < 2) return tableBlock

      const parseRow = (r: string) =>
        r.split('|').slice(1, -1).map(c => c.trim())

      const headers = parseRow(rows[0])
      // Skip separator row (row[1])
      const bodyRows = rows.slice(2)

      let t = '<table><thead><tr>'
      headers.forEach(h => { t += `<th>${h}</th>` })
      t += '</tr></thead><tbody>'
      bodyRows.forEach(r => {
        const cells = parseRow(r)
        t += '<tr>'
        cells.forEach(c => { t += `<td>${c}</td>` })
        t += '</tr>'
      })
      t += '</tbody></table>'
      return '\n' + t + '\n'
    },
  )

  // Headings (#### → h4, ### → h3)
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n')

  // Unordered lists
  html = html.replace(/(?:^|\n)((?:- [^\n]+\n?)+)/g, (_m, block: string) => {
    const items = block.trim().split('\n').map(l => l.replace(/^- /, ''))
    return '\n<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>\n'
  })

  // Paragraphs — wrap remaining text lines
  html = html
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (
        trimmed.startsWith('<') ||
        trimmed.startsWith('#')
      ) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n\n')

  return html
}

/** Derive a URL-friendly id from a section title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ReferencePage() {
  // Split by ## headings into sections
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
      {/* Preamble / intro */}
      {preamble && (
        <div
          className="mb-10 prose prose-slate max-w-none prose-blockquote:border-turquoise prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-p:text-muted-foreground prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(preamble) }}
        />
      )}

      {/* Table of contents */}
      <nav className="mb-12 rounded-xl border border-border bg-stone/50 p-6">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-foreground mb-3">
          Contents
        </h3>
        <div className="columns-2 gap-6">
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#${slugify(s.title)}`}
              className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
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
    </DesignSystemLayout>
  )
}
