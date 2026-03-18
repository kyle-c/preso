'use client'

import { useState, useCallback, useRef } from 'react'

export type PdfStatus = 'idle' | 'rendering' | 'capturing' | 'building' | 'done'

export interface PdfProgress {
  status: PdfStatus
  current: number
  total: number
}

export interface PdfCaptureOptions {
  /** Ref to the slide container DOM element */
  slideRef: React.RefObject<HTMLElement | null>
  /** Total number of slides */
  total: number
  /** Current slide index (to restore after export) */
  currentSlide: number
  /** Function to navigate to a specific slide */
  goToSlide: (index: number) => void
}

const SLIDE_W = 1280
const SLIDE_H = 720

// Wait for all <img> and <object> elements inside a container to load
async function waitForMedia(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll('img'))
  await Promise.all(
    imgs
      .filter(img => !img.complete)
      .map(img => new Promise<void>(res => {
        img.addEventListener('load', () => res(), { once: true })
        img.addEventListener('error', () => res(), { once: true })
      }))
  )
}

// Convert <object type="image/svg+xml"> elements to <img> for capture
function promoteObjectsToImgs(el: HTMLElement): () => void {
  const objects = Array.from(el.querySelectorAll('object[type="image/svg+xml"]')) as HTMLObjectElement[]
  const replacements: Array<{ obj: HTMLObjectElement; img: HTMLImageElement }> = []

  for (const obj of objects) {
    const src = obj.getAttribute('data') ?? ''
    if (!src) continue
    const img = document.createElement('img')
    img.src = src
    img.className = obj.className
    img.setAttribute('style', obj.getAttribute('style') ?? '')
    img.setAttribute('aria-hidden', 'true')
    obj.parentElement?.replaceChild(img, obj)
    replacements.push({ obj, img })
  }

  return () => {
    for (const { obj, img } of replacements) {
      img.parentElement?.replaceChild(obj, img)
    }
  }
}

// Replace YouTube iframes with their thumbnail image for capture
function promoteIframesToImgs(el: HTMLElement): () => void {
  const iframes = Array.from(el.querySelectorAll('iframe')) as HTMLIFrameElement[]
  const replacements: Array<{ iframe: HTMLIFrameElement; img: HTMLImageElement }> = []

  for (const iframe of iframes) {
    const src = iframe.src ?? ''
    // Extract YouTube video ID from embed URL
    const ytMatch = src.match(/youtube\.com\/embed\/([^?/]+)/)
    if (!ytMatch) continue
    const videoId = ytMatch[1]
    const img = document.createElement('img')
    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    img.className = iframe.className
    img.setAttribute('style', iframe.getAttribute('style') ?? '')
    img.style.objectFit = 'cover'
    iframe.parentElement?.replaceChild(img, iframe)
    replacements.push({ iframe, img })
  }

  return () => {
    for (const { iframe, img } of replacements) {
      img.parentElement?.replaceChild(iframe, img)
    }
  }
}

// Convert box-shadow to filter: drop-shadow() for SVG foreignObject compatibility.
// box-shadow renders as hard rectangles in SVG; drop-shadow uses the alpha channel correctly.
function convertBoxShadows(el: HTMLElement): () => void {
  const all = [el, ...Array.from(el.querySelectorAll('*'))] as HTMLElement[]
  const patches: Array<{ el: HTMLElement; origFilter: string; origShadow: string }> = []

  for (const node of all) {
    if (!(node instanceof HTMLElement)) continue
    const computed = getComputedStyle(node)
    const shadow = computed.boxShadow
    if (!shadow || shadow === 'none') continue

    // Parse box-shadow values: offset-x offset-y blur spread? color
    // Convert each to drop-shadow(offset-x offset-y blur color)
    const dropShadows = shadow.split(/,(?![^(]*\))/).map(s => {
      const trimmed = s.trim()
      // Extract color (rgb/rgba/hsl/hex at start or end)
      const colorMatch = trimmed.match(/(rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8})/)
      const color = colorMatch ? colorMatch[0] : 'rgba(0,0,0,0.1)'
      // Remove color and 'inset' to get numeric values
      const nums = trimmed
        .replace(/(rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8})/g, '')
        .replace(/inset/g, '')
        .trim()
        .split(/\s+/)
        .map(parseFloat)
        .filter(n => !isNaN(n))
      const [ox = 0, oy = 0, blur = 0] = nums
      return `drop-shadow(${ox}px ${oy}px ${blur}px ${color})`
    })

    const origFilter = node.style.filter
    const origShadow = node.style.boxShadow
    node.style.filter = [computed.filter !== 'none' ? computed.filter : '', ...dropShadows].filter(Boolean).join(' ')
    node.style.boxShadow = 'none'
    patches.push({ el: node, origFilter, origShadow })
  }

  return () => {
    for (const p of patches) {
      p.el.style.filter = p.origFilter
      p.el.style.boxShadow = p.origShadow
    }
  }
}

// Bump very tight line-heights on large text to prevent descender/ascender overlap in PDF
function fixTightLeading(el: HTMLElement): () => void {
  const all = Array.from(el.querySelectorAll('*')) as HTMLElement[]
  const patches: Array<{ el: HTMLElement; orig: string }> = []

  for (const node of all) {
    if (!(node instanceof HTMLElement)) continue
    const computed = getComputedStyle(node)
    const fontSize = parseFloat(computed.fontSize)
    const lineHeight = parseFloat(computed.lineHeight)
    // Only fix large text (>36px) with line-height ratio below 1.0
    if (fontSize > 36 && lineHeight > 0 && lineHeight / fontSize < 1.0) {
      const orig = node.style.lineHeight
      node.style.lineHeight = '1.05'
      patches.push({ el: node, orig })
    }
  }

  return () => {
    for (const p of patches) {
      p.el.style.lineHeight = p.orig
    }
  }
}

// Force the slide container to exactly 1280×720 for capture, then restore
function lockSlideSize(el: HTMLElement): () => void {
  const parent = el.closest('[class*="h-screen"]') as HTMLElement | null
  const targets = parent ? [parent, el] : [el]
  const originals = targets.map(t => t.getAttribute('style') ?? '')

  for (const t of targets) {
    t.style.width = `${SLIDE_W}px`
    t.style.height = `${SLIDE_H}px`
    t.style.minWidth = `${SLIDE_W}px`
    t.style.minHeight = `${SLIDE_H}px`
    t.style.maxWidth = `${SLIDE_W}px`
    t.style.maxHeight = `${SLIDE_H}px`
    t.style.overflow = 'hidden'
  }

  return () => {
    targets.forEach((t, i) => {
      t.setAttribute('style', originals[i])
    })
  }
}

export interface ViewPdfCaptureOptions {
  /** Selector or data attribute to find the view container */
  viewMode: 'outline' | 'document'
}

export function useSlidePdf(filename = 'presentation.pdf') {
  const [progress, setProgress] = useState<PdfProgress>({ status: 'idle', current: 0, total: 0 })
  const abortRef = useRef(false)

  // Download the current outline/document view as a portrait PDF
  const downloadView = useCallback(
    async ({ viewMode }: ViewPdfCaptureOptions) => {
      abortRef.current = false
      setProgress({ status: 'rendering', current: 0, total: 1 })

      try {
        const { domToJpeg } = await import('modern-screenshot')
        const { jsPDF } = await import('jspdf')

        // Find the view container
        const container = document.querySelector(`[data-view="${viewMode}"]`) as HTMLElement | null
        if (!container) { console.warn('[useSlidePdf] view container not found'); return }

        // Find the scrollable content inside
        const scrollable = container.querySelector('.overflow-y-auto') as HTMLElement | null
        const captureTarget = scrollable ?? container

        await document.fonts.ready

        setProgress({ status: 'capturing', current: 1, total: 1 })

        // Capture the full scrollable content at its natural width
        const captureW = captureTarget.scrollWidth
        const captureH = captureTarget.scrollHeight

        // Temporarily expand the scrollable element to show full content
        const origHeight = captureTarget.style.height
        const origOverflow = captureTarget.style.overflow
        const origMaxHeight = captureTarget.style.maxHeight
        captureTarget.style.height = `${captureH}px`
        captureTarget.style.overflow = 'visible'
        captureTarget.style.maxHeight = 'none'

        // Also expand the parent container
        const origContainerHeight = container.style.height
        const origContainerOverflow = container.style.overflow
        container.style.height = `${captureH}px`
        container.style.overflow = 'visible'

        await new Promise(r => setTimeout(r, 200))

        const restoreShadows = convertBoxShadows(captureTarget)

        try {
          const dataUrl = await domToJpeg(captureTarget, {
            scale: 2,
            quality: 0.93,
            width: captureW,
            height: captureH,
            style: {
              animationPlayState: 'paused',
              animationDelay: '-999s',
            },
            filter: (node: Node) => {
              if (!(node instanceof HTMLElement)) return true
              const cls = node.className
              if (typeof cls !== 'string') return true
              if (cls.includes('comment')) return false
              return true
            },
          })

          setProgress({ status: 'building', current: 1, total: 1 })

          // Create portrait A4-ish PDF, paginated from the tall capture
          const PAGE_W_PT = 595.28  // A4 width in points
          const PAGE_H_PT = 841.89  // A4 height in points
          const imgAspect = captureH / captureW
          const imgWidthPt = PAGE_W_PT
          const imgHeightPt = imgWidthPt * imgAspect

          // How many pages needed
          const totalPages = Math.ceil(imgHeightPt / PAGE_H_PT)
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })

          for (let p = 0; p < totalPages; p++) {
            if (p > 0) pdf.addPage('a4', 'portrait')
            // Offset the image upward for each page
            const yOffset = -p * PAGE_H_PT
            pdf.addImage(dataUrl, 'JPEG', 0, yOffset, imgWidthPt, imgHeightPt, undefined, 'FAST')
          }

          const viewName = viewMode === 'outline' ? 'outline' : 'document'
          const pdfFilename = filename.replace('.pdf', `-${viewName}.pdf`)
          pdf.save(pdfFilename)

          setProgress({ status: 'done', current: 1, total: 1 })
        } finally {
          restoreShadows()
          // Restore styles
          captureTarget.style.height = origHeight
          captureTarget.style.overflow = origOverflow
          captureTarget.style.maxHeight = origMaxHeight
          container.style.height = origContainerHeight
          container.style.overflow = origContainerOverflow
        }
      } catch (err) {
        console.error('[useSlidePdf] view capture error:', err)
      } finally {
        await new Promise(r => setTimeout(r, 500))
        setProgress({ status: 'idle', current: 0, total: 0 })
      }
    },
    [filename]
  )

  const download = useCallback(
    async ({ slideRef, total, currentSlide, goToSlide }: PdfCaptureOptions) => {
      abortRef.current = false

      setProgress({ status: 'rendering', current: 0, total })

      try {
        const { domToJpeg } = await import('modern-screenshot')
        const { jsPDF } = await import('jspdf')
        const PT_W = (SLIDE_W * 72) / 96
        const PT_H = (SLIDE_H * 72) / 96
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [PT_W, PT_H] })

        for (let i = 0; i < total; i++) {
          if (abortRef.current) break

          setProgress({ status: 'capturing', current: i + 1, total })

          // Navigate to the slide and wait for React render + animations
          goToSlide(i)
          await new Promise((r) => setTimeout(r, 800))
          await document.fonts.ready

          const el = slideRef.current
          if (!el) continue

          // Lock to exact 16:9 slide dimensions before capture
          const restoreSize = lockSlideSize(el)
          // Wait for reflow at new size
          await new Promise((r) => setTimeout(r, 100))

          // Promote SVG objects and YouTube iframes to images
          const restoreObjects = promoteObjectsToImgs(el)
          const restoreIframes = promoteIframesToImgs(el)
          // Convert box-shadow → drop-shadow for SVG foreignObject rendering
          const restoreShadows = convertBoxShadows(el)
          // Fix tight line-heights on large headings to prevent text overlap
          const restoreLeading = fixTightLeading(el)
          await waitForMedia(el)
          await new Promise((r) => setTimeout(r, 200))

          try {
            const dataUrl = await domToJpeg(el, {
              scale: 2,
              quality: 0.93,
              width: SLIDE_W,
              height: SLIDE_H,
              style: {
                animationPlayState: 'paused',
                animationDelay: '-999s',
              },
              filter: (node: Node) => {
                if (!(node instanceof HTMLElement)) return true
                const cls = node.className
                if (typeof cls !== 'string') return true
                if (cls.includes('comment')) return false
                return true
              },
            })

            if (i > 0) pdf.addPage([PT_W, PT_H], 'landscape')
            pdf.addImage(dataUrl, 'JPEG', 0, 0, PT_W, PT_H, undefined, 'FAST')
          } catch (slideErr) {
            console.warn(`[useSlidePdf] failed to capture slide ${i + 1}, skipping:`, slideErr)
            if (i > 0) pdf.addPage([PT_W, PT_H], 'landscape')
          } finally {
            restoreLeading()
            restoreShadows()
            restoreIframes()
            restoreObjects()
            restoreSize()
          }
        }

        if (!abortRef.current) {
          setProgress({ status: 'building', current: total, total })
          await new Promise((r) => setTimeout(r, 100))
          pdf.save(filename)
          setProgress({ status: 'done', current: total, total })
        }

        // Restore original slide
        goToSlide(currentSlide)
      } catch (err) {
        console.error('[useSlidePdf] error:', err)
      } finally {
        await new Promise((r) => setTimeout(r, 500))
        setProgress({ status: 'idle', current: 0, total: 0 })
      }
    },
    [filename]
  )

  const cancel = useCallback(() => {
    abortRef.current = true
    setProgress({ status: 'idle', current: 0, total: 0 })
  }, [])

  return { progress, download, downloadView, cancel }
}
