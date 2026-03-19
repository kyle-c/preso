'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Save, ArrowLeft, ChevronRight, RefreshCw, Upload, X, ImageIcon, FileSpreadsheet } from 'lucide-react'
import type { PresentationDocument, DocumentSection, SectionAttachment } from '@/lib/studio-db'

/** Lightweight markdown → HTML for document content */
function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>')
  html = html.replace(/(?<!\w)_([^_]+?)_(?!\w)/g, '<em>$1</em>')
  html = html.replace(/`([^`]+?)`/g, '<code>$1</code>')
  // Markdown links: [text](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-evergreen underline decoration-evergreen/30 hover:decoration-evergreen/60">$1</a>')
  // Bare URLs (not already in an href)
  html = html.replace(/(?<!href=")(https?:\/\/[^\s<>&]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-evergreen underline decoration-evergreen/30 hover:decoration-evergreen/60">$1</a>')

  const lines = html.split('\n')
  const out: string[] = []
  let inList: 'ul' | 'ol' | null = null
  let inTable = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const ulMatch = line.match(/^(\s*)[\*\-]\s+(.+)/)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)/)
    const h3Match = line.match(/^###\s+(.+)/)
    const h4Match = line.match(/^####\s+(.+)/)
    const hrMatch = line.match(/^---+$/)
    const tableMatch = line.match(/^\|(.+)\|$/)
    const tableSepMatch = line.match(/^\|[\s\-:|]+\|$/)

    // Close list if transitioning out
    if (!ulMatch && !olMatch && inList) { out.push(`</${inList}>`); inList = null }

    if (h3Match) {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      out.push(`<h3>${h3Match[1]}</h3>`)
    } else if (h4Match) {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      out.push(`<h4>${h4Match[1]}</h4>`)
    } else if (hrMatch) {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      out.push('<hr/>')
    } else if (tableSepMatch) {
      // Skip separator row (already started table from header)
      continue
    } else if (tableMatch) {
      const cells = tableMatch[1].split('|').map(c => c.trim())
      if (!inTable) {
        // First table row = header
        out.push('<table><thead><tr>')
        cells.forEach(c => out.push(`<th>${c}</th>`))
        out.push('</tr></thead><tbody>')
        inTable = true
      } else {
        out.push('<tr>')
        cells.forEach(c => out.push(`<td>${c}</td>`))
        out.push('</tr>')
      }
    } else if (ulMatch) {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      if (inList !== 'ul') { out.push('<ul>'); inList = 'ul' }
      out.push(`<li>${ulMatch[2]}</li>`)
    } else if (olMatch) {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      if (inList !== 'ol') { out.push('<ol>'); inList = 'ol' }
      out.push(`<li>${olMatch[2]}</li>`)
    } else {
      if (inTable) { out.push('</tbody></table>'); inTable = false }
      if (line.trim() === '') {
        out.push('<br/>')
      } else {
        out.push(`<p>${line}</p>`)
      }
    }
  }
  if (inList) out.push(`</${inList}>`)
  if (inTable) out.push('</tbody></table>')

  return out.join('')
}

interface DocumentPanelProps {
  document: PresentationDocument
  currentSlide: number
  onClose: () => void
  onSave: (document: PresentationDocument) => void
  onRebuild?: (document: PresentationDocument) => void
  rebuilding?: boolean
  onGoToSlide?: (index: number) => void
  visible: boolean
}

export function DocumentPanel({
  document,
  currentSlide,
  onClose,
  onSave,
  onRebuild,
  rebuilding,
  onGoToSlide,
  visible,
}: DocumentPanelProps) {
  const [dirty, setDirty] = useState(false)
  const [localDoc, setLocalDoc] = useState(document)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Animate in after mount
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setMounted(true))
    } else {
      setMounted(false)
    }
  }, [visible])

  // Auto-save with debounce
  const markDirty = useCallback((updatedDoc: PresentationDocument) => {
    setLocalDoc(updatedDoc)
    setDirty(true)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      onSave(updatedDoc)
      setDirty(false)
    }, 1500)
  }, [onSave])

  const updateTitle = useCallback((title: string) => {
    markDirty({ ...localDoc, title })
  }, [localDoc, markDirty])

  const updateSummary = useCallback((summary: string) => {
    markDirty({ ...localDoc, summary })
  }, [localDoc, markDirty])

  const updateSectionTitle = useCallback((index: number, title: string) => {
    markDirty({
      ...localDoc,
      sections: localDoc.sections.map((s, i) => i === index ? { ...s, title } : s),
    })
  }, [localDoc, markDirty])

  const updateSectionContent = useCallback((index: number, content: string) => {
    markDirty({
      ...localDoc,
      sections: localDoc.sections.map((s, i) => i === index ? { ...s, content } : s),
    })
  }, [localDoc, markDirty])

  const handleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    onSave(localDoc)
    setDirty(false)
  }, [localDoc, onSave])

  const addAttachment = useCallback((sectionIndex: number, attachment: SectionAttachment) => {
    const updated = {
      ...localDoc,
      sections: localDoc.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, attachments: [...(s.attachments ?? []), attachment] }
          : s
      ),
    }
    markDirty(updated)
  }, [localDoc, markDirty])

  const removeAttachment = useCallback((sectionIndex: number, attachmentId: string) => {
    const updated = {
      ...localDoc,
      sections: localDoc.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, attachments: (s.attachments ?? []).filter((a) => a.id !== attachmentId) }
          : s
      ),
    }
    markDirty(updated)
  }, [localDoc, markDirty])

  const handleClose = useCallback(() => {
    // Flush any pending save
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      if (dirty) onSave(localDoc)
    }
    setMounted(false)
    setTimeout(onClose, 350)
  }, [onClose, dirty, localDoc, onSave])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex flex-col transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        backgroundColor: mounted ? '#FEFCF9' : 'rgba(254,252,249,0)',
        opacity: mounted ? 1 : 0,
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 lg:px-10 py-4 shrink-0 transition-all duration-[350ms] ease-out"
        style={{
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          opacity: mounted ? 1 : 0,
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-evergreen hover:bg-stone transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Presentation
        </button>

        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-xs text-mocha/60 italic">Saving...</span>
          )}
          {onRebuild && (
            <button
              type="button"
              onClick={() => {
                if (dirty) {
                  if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
                  onSave(localDoc)
                  setDirty(false)
                }
                onRebuild(localDoc)
              }}
              disabled={rebuilding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-evergreen/20 text-evergreen hover:bg-stone transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebuilding ? 'animate-spin' : ''}`} />
              {rebuilding ? 'Rebuilding...' : 'Rebuild Slides'}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 pb-20"
      >
        <div
          className="max-w-[1100px] mx-auto transition-all duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
            opacity: mounted ? 1 : 0,
            transitionDelay: '80ms',
          }}
        >
          {/* White document card */}
          <div className="bg-white rounded-2xl shadow-lg border border-concrete/40 px-10 py-12 lg:px-14 lg:py-16">
            {/* Document type badge */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-turquoise-50 text-turquoise-700 border border-turquoise-200">
                {localDoc.type}
              </span>
            </div>

            {/* Title — editable */}
            <h1
              className="font-display font-black text-slate-950 mb-6 outline-none focus:ring-0 rounded-lg -mx-2 px-2 py-1 hover:bg-stone/30 focus:bg-stone/30 transition-colors"
              style={{
                fontSize: 'var(--text-heading-1)',
                lineHeight: 'var(--leading-heading-1)',
                letterSpacing: 'var(--tracking-heading)',
              }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const text = e.currentTarget.innerText.trim()
                if (text && text !== localDoc.title) updateTitle(text)
              }}
              dangerouslySetInnerHTML={{ __html: localDoc.title }}
            />

            {/* Divider */}
            <div className="w-12 h-0.5 bg-turquoise mb-10" />

            {/* Executive Summary — editable */}
            <section className="mb-12">
              <h2
                className="font-display font-extrabold text-slate-950 uppercase tracking-wider mb-3"
                style={{
                  fontSize: 'var(--text-caption)',
                  lineHeight: 'var(--leading-heading-3)',
                  letterSpacing: 'var(--tracking-caption)',
                  color: 'var(--mocha)',
                }}
              >
                Executive Summary
              </h2>
              <EditableBlock
                content={localDoc.summary}
                onChange={updateSummary}
                className="doc-prose text-evergreen"
                style={{
                  fontSize: 'var(--text-body-lg)',
                  lineHeight: 'var(--leading-body)',
                }}
              />
            </section>

            {/* Sections */}
            {localDoc.sections.map((section, i) => (
              <SectionBlock
                key={i}
                section={section}
                index={i}
                onTitleChange={(title) => updateSectionTitle(i, title)}
                onContentChange={(content) => updateSectionContent(i, content)}
                onGoToSlide={onGoToSlide ? (idx) => { handleClose(); setTimeout(() => onGoToSlide(idx), 400) } : undefined}
                onAddAttachment={(att) => addAttachment(i, att)}
                onRemoveAttachment={(attId) => removeAttachment(i, attId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Editable Block (contentEditable with markdown rendering) ─── */

function EditableBlock({
  content,
  onChange,
  className,
  style,
}: {
  content: string
  onChange: (text: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const lastContent = useRef(content)

  // Only update innerHTML when content changes externally (not from user typing)
  useEffect(() => {
    if (ref.current && content !== lastContent.current) {
      lastContent.current = content
      ref.current.innerHTML = renderMarkdown(content)
    }
  }, [content])

  // Set initial HTML
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = renderMarkdown(content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInput = useCallback(() => {
    if (!ref.current) return
    const text = ref.current.innerText
    lastContent.current = text
    onChange(text)
  }, [onChange])

  return (
    <div
      ref={ref}
      className={`outline-none focus:ring-0 rounded-lg -mx-2 px-2 py-1 hover:bg-stone/20 focus:bg-stone/20 transition-colors ${className ?? ''}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
    />
  )
}

/* ─── File processing helpers ─── */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function parseDataFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'csv' || ext === 'tsv') {
    return file.text()
  }
  const XLSX = (await import('xlsx')).default
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  return XLSX.utils.sheet_to_csv(sheet)
}

function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

function isDataFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ['csv', 'tsv', 'xlsx', 'xls'].includes(ext ?? '')
}

/* ─── Section Block ─── */

function SectionBlock({
  section,
  index,
  onTitleChange,
  onContentChange,
  onGoToSlide,
  onAddAttachment,
  onRemoveAttachment,
}: {
  section: DocumentSection
  index: number
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onGoToSlide?: (index: number) => void
  onAddAttachment: (attachment: SectionAttachment) => void
  onRemoveAttachment: (attachmentId: string) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    setProcessing(true)
    try {
      for (const file of files) {
        if (isImageFile(file)) {
          const data = await fileToBase64(file)
          onAddAttachment({
            id: crypto.randomUUID(),
            name: file.name,
            type: 'image',
            data,
            preview: data,
          })
        } else if (isDataFile(file)) {
          const csvText = await parseDataFile(file)
          const lines = csvText.split('\n')
          const preview = lines.slice(0, 4).join('\n')
          onAddAttachment({
            id: crypto.randomUUID(),
            name: file.name,
            type: 'data',
            data: csvText,
            preview,
          })
        }
      }
    } catch (err) {
      console.error('Error processing dropped file:', err)
    } finally {
      setProcessing(false)
    }
  }, [onAddAttachment])

  const attachments = section.attachments ?? []

  return (
    <section
      className="mb-10 last:mb-0 rounded-xl relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 z-10 rounded-xl border-2 border-dashed border-turquoise bg-turquoise/5 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-turquoise" />
            <span className="text-sm font-medium text-turquoise">Drop images or data files</span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Editable title */}
          <h3
            className="font-display font-extrabold text-slate-950 outline-none focus:ring-0 rounded-lg -mx-1 px-1 hover:bg-stone/30 focus:bg-stone/30 transition-colors flex-1"
            style={{
              fontSize: 'var(--text-heading-3)',
              lineHeight: 'var(--leading-heading-3)',
              letterSpacing: 'var(--tracking-normal)',
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.innerText.trim()
              if (text && text !== section.title) onTitleChange(text)
            }}
            dangerouslySetInnerHTML={{ __html: section.title }}
          />
          {section.slideIndex !== undefined && (
            <button
              type="button"
              onClick={() => onGoToSlide?.(section.slideIndex!)}
              className="flex-shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium text-mocha hover:text-turquoise-700 hover:bg-turquoise-50 transition-colors"
            >
              Slide {section.slideIndex + 1}
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Editable content */}
      <EditableBlock
        content={section.content}
        onChange={onContentChange}
        className="doc-prose text-evergreen"
        style={{
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)',
        }}
      />

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="group relative rounded-xl border border-concrete/50 bg-linen overflow-hidden transition-shadow hover:shadow-md"
              style={{ maxWidth: att.type === 'image' ? 200 : 280 }}
            >
              {att.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={att.preview || att.data}
                  alt={att.name}
                  className="w-full h-auto max-h-36 object-cover"
                />
              ) : (
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-mocha" />
                    <span className="text-[11px] font-medium text-slate-950 truncate">{att.name}</span>
                  </div>
                  <pre className="text-[10px] text-mocha leading-relaxed whitespace-pre-wrap line-clamp-4 font-mono">
                    {att.preview || att.data.slice(0, 200)}
                  </pre>
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveAttachment(att.id)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 text-mocha hover:text-slate-950 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="px-3 py-1.5 border-t border-concrete/30 flex items-center gap-1">
                {att.type === 'image' ? (
                  <ImageIcon className="w-3 h-3 text-mocha/60" />
                ) : (
                  <FileSpreadsheet className="w-3 h-3 text-mocha/60" />
                )}
                <span className="text-[10px] text-mocha truncate">{att.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processing indicator */}
      {processing && (
        <div className="mt-3 flex items-center gap-2 text-mocha">
          <div className="w-3.5 h-3.5 border-2 border-turquoise/30 border-t-turquoise rounded-full animate-spin" />
          <span className="text-xs">Processing file...</span>
        </div>
      )}
    </section>
  )
}
