'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, X, Palette, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandKit, BrandColor, BrandIllustration } from '@/lib/brand-kit'
import { categorizeIllustration } from '@/lib/brand-kit'

/* ═══════════════════════════════════════════════════════════ */
/*                    BRAND KIT EDITOR                         */
/*                                                              */
/*  Full brand configuration UI with:                          */
/*  - Drag-and-drop JSON/MD brand file upload                  */
/*  - Color palette editor                                     */
/*  - Typography settings                                      */
/*  - Illustration manager with auto-categorization            */
/*  - Live preview of brand identity                           */
/* ═══════════════════════════════════════════════════════════ */

interface BrandKitEditorProps {
  onClose: () => void
}

function ColorSwatch({ color, onRemove }: { color: BrandColor; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2 group">
      <div
        className="w-6 h-6 rounded-md border border-white/10 shrink-0"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-white/80">{color.name}</span>
        <span className="text-[10px] text-white/40 ml-1.5 font-mono">{color.hex}</span>
      </div>
      {onRemove && (
        <button type="button" onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function ColorSection({ title, colors, onChange }: { title: string; colors: BrandColor[]; onChange: (colors: BrandColor[]) => void }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newHex, setNewHex] = useState('#')

  const addColor = () => {
    if (newName && newHex.match(/^#[0-9a-fA-F]{3,8}$/)) {
      onChange([...colors, { name: newName, hex: newHex }])
      setNewName('')
      setNewHex('#')
      setAdding(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-white/40">{title}</span>
        <button type="button" onClick={() => setAdding(!adding)} className="text-[10px] text-turquoise hover:text-turquoise/80">
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>
      <div className="space-y-1.5">
        {colors.map((c, i) => (
          <ColorSwatch key={i} color={c} onRemove={() => onChange(colors.filter((_, j) => j !== i))} />
        ))}
      </div>
      {adding && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Name"
            className="flex-1 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30"
          />
          <input
            type="text"
            value={newHex}
            onChange={e => setNewHex(e.target.value)}
            placeholder="#hex"
            className="w-24 px-2 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30"
          />
          <button type="button" onClick={addColor} className="px-2 py-1 text-xs bg-turquoise text-slate-950 rounded font-medium">
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export function BrandKitEditor({ onClose }: BrandKitEditorProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [brandFileUrl, setBrandFileUrl] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [fontResults, setFontResults] = useState<{ query: string; family: string; found: boolean; cssUrl?: string }[]>([])
  const [fontsChecking, setFontsChecking] = useState(false)
  const fontUploadRef = useRef<HTMLInputElement>(null)
  const [dragOverFont, setDragOverFont] = useState(false)
  const [uploadedFonts, setUploadedFonts] = useState<{ name: string; file: string }[]>([])

  // Brand kit state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mission, setMission] = useState('')
  const [tone, setTone] = useState('')
  const [displayFont, setDisplayFont] = useState('')
  const [bodyFont, setBodyFont] = useState('')
  const [darkBg, setDarkBg] = useState('#1a1a2e')
  const [lightBg, setLightBg] = useState('#f5f5f5')
  const [brandBg, setBrandBg] = useState('#3b82f6')
  const [primaryColors, setPrimaryColors] = useState<BrandColor[]>([])
  const [secondaryColors, setSecondaryColors] = useState<BrandColor[]>([])
  const [neutralColors, setNeutralColors] = useState<BrandColor[]>([])
  const [illustrations, setIllustrations] = useState<BrandIllustration[]>([])
  const [hasKit, setHasKit] = useState(false)

  // Load existing brand kit
  useEffect(() => {
    fetch('/api/studio/brand-kit')
      .then(res => res.json())
      .then(data => {
        if (data.brandKit) {
          const kit = data.brandKit as BrandKit
          setName(kit.name)
          setDescription(kit.description)
          setMission(kit.mission)
          setTone(kit.tone)
          setDisplayFont(kit.displayFont)
          setBodyFont(kit.bodyFont)
          setDarkBg(kit.darkBg)
          setLightBg(kit.lightBg)
          setBrandBg(kit.brandBg)
          setPrimaryColors(kit.primaryColors)
          setSecondaryColors(kit.secondaryColors)
          setNeutralColors(kit.neutralColors)
          setIllustrations(kit.illustrations)
          setHasKit(true)
          // Resolve fonts on load
          const fontSpecs = [kit.displayFont, kit.bodyFont].filter(f => f && f !== 'System default')
          if (fontSpecs.length > 0) {
            setFontsChecking(true)
            fetch('/api/studio/fonts/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fonts: fontSpecs }),
            })
              .then(res => res.ok ? res.json() : null)
              .then(data => { if (data?.results) setFontResults(data.results) })
              .catch(() => {})
              .finally(() => setFontsChecking(false))
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/studio/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description, mission, tone, displayFont, bodyFont,
          darkBg, lightBg, brandBg, primaryColors, secondaryColors, neutralColors, illustrations,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Save failed')
      } else {
        setSaved(true)
        setHasKit(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      setError('Network error')
    }
    setSaving(false)
  }, [name, description, mission, tone, displayFont, bodyFont, darkBg, lightBg, brandBg, primaryColors, secondaryColors, neutralColors, illustrations])

  const handleDelete = useCallback(async () => {
    try {
      await fetch('/api/studio/brand-kit', { method: 'DELETE' })
      setName('')
      setDescription('')
      setMission('')
      setTone('')
      setDisplayFont('')
      setBodyFont('')
      setDarkBg('#1a1a2e')
      setLightBg('#f5f5f5')
      setBrandBg('#3b82f6')
      setPrimaryColors([])
      setSecondaryColors([])
      setNeutralColors([])
      setIllustrations([])
      setHasKit(false)
    } catch {}
  }, [])

  // Shared: apply a loaded brand kit to state and resolve fonts
  const applyBrandKit = useCallback(async (kit: BrandKit) => {
    setName(kit.name)
    setDescription(kit.description)
    setMission(kit.mission)
    setTone(kit.tone)
    setDisplayFont(kit.displayFont)
    setBodyFont(kit.bodyFont)
    setDarkBg(kit.darkBg)
    setLightBg(kit.lightBg)
    setBrandBg(kit.brandBg)
    setPrimaryColors(kit.primaryColors)
    setSecondaryColors(kit.secondaryColors)
    setNeutralColors(kit.neutralColors)
    setIllustrations(kit.illustrations)
    setHasKit(true)
    setSaved(true)
    setFontResults([])
    setUploadedFonts([])
    setTimeout(() => setSaved(false), 2000)

    // Resolve fonts via Google Fonts
    const fontSpecs = [kit.displayFont, kit.bodyFont].filter(f => f && f !== 'System default')
    if (fontSpecs.length > 0) {
      setFontsChecking(true)
      try {
        const res = await fetch('/api/studio/fonts/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fonts: fontSpecs }),
        })
        if (res.ok) {
          const data = await res.json()
          setFontResults(data.results || [])
        }
      } catch {}
      setFontsChecking(false)
    }
  }, [])

  const handleFileUpload = useCallback(async (file: File) => {
    const content = await file.text()
    try {
      const res = await fetch('/api/studio/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileContent: content, fileName: file.name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }
      await applyBrandKit(data.brandKit as BrandKit)
    } catch {
      setError('Upload failed')
    }
  }, [applyBrandKit])

  const handleUrlImport = useCallback(async () => {
    if (!brandFileUrl.trim()) return
    setUrlLoading(true)
    setError('')
    // Auto-prepend https:// if no protocol
    let url = brandFileUrl.trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    try {
      const res = await fetch('/api/studio/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Import failed')
        setUrlLoading(false)
        return
      }
      await applyBrandKit(data.brandKit as BrandKit)
      setBrandFileUrl('')
    } catch {
      setError('Import failed')
    }
    setUrlLoading(false)
  }, [brandFileUrl])

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] bg-slate-950 rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-turquoise" />
              Brand Kit
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Configure your brand for AI-generated presentations</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-white/40 text-sm">Loading...</div>
          ) : (
            <>
              {/* Import from URL or file */}
              <div className="rounded-xl border border-white/10 p-4 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Import brand definition</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandFileUrl}
                    onChange={e => setBrandFileUrl(e.target.value)}
                    placeholder="Paste a link to a .json or .md file"
                    className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30"
                    onKeyDown={e => { if (e.key === 'Enter') handleUrlImport() }}
                  />
                  <button
                    type="button"
                    onClick={handleUrlImport}
                    disabled={!brandFileUrl.trim() || urlLoading}
                    className="px-4 py-2 text-xs font-semibold bg-turquoise text-slate-950 rounded-lg hover:bg-turquoise/90 disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    {urlLoading ? 'Importing...' : 'Import'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-white/30">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-xs text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Browse for a .json or .md file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.md"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                    e.target.value = ''
                  }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Typefaces — pills + drop zone */}
              {(fontResults.length > 0 || fontsChecking) && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Typefaces</p>

                  {fontsChecking ? (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Checking Google Fonts...
                    </div>
                  ) : (
                    <>
                      {/* Font pills */}
                      <div className="flex flex-wrap gap-2">
                        {fontResults.map((f, i) => (
                          <div
                            key={i}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                              f.found
                                ? 'bg-turquoise/10 text-turquoise border border-turquoise/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                            )}
                          >
                            {f.found ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            ) : (
                              <span className="text-[9px] font-bold">!</span>
                            )}
                            {f.family}
                            <span className="text-[9px] opacity-60">{f.found ? 'Google Fonts' : 'Custom'}</span>
                          </div>
                        ))}
                        {uploadedFonts.map((f, i) => (
                          <div key={`u-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-turquoise/10 text-turquoise border border-turquoise/20">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {f.name}
                            <button
                              type="button"
                              onClick={() => setUploadedFonts(prev => prev.filter((_, j) => j !== i))}
                              className="hover:text-white transition-colors ml-0.5"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Compact drop zone — only when custom fonts need uploading */}
                      {fontResults.some(f => !f.found) && uploadedFonts.length === 0 && (
                        <div
                          onDragOver={e => { e.preventDefault(); setDragOverFont(true) }}
                          onDragLeave={() => setDragOverFont(false)}
                          onDrop={e => {
                            e.preventDefault()
                            setDragOverFont(false)
                            const files = Array.from(e.dataTransfer.files).filter(f => /\.(woff2?|ttf|otf|eot)$/i.test(f.name))
                            if (files.length === 0) return
                            Promise.all(files.map(async f => {
                              const reader = new FileReader()
                              return new Promise<{ name: string; file: string }>(resolve => {
                                reader.onload = () => resolve({ name: f.name, file: reader.result as string })
                                reader.readAsDataURL(f)
                              })
                            })).then(results => setUploadedFonts(prev => [...prev, ...results]))
                          }}
                          className={cn(
                            'border border-dashed rounded-xl px-4 py-3 text-center transition-colors cursor-pointer',
                            dragOverFont ? 'border-turquoise bg-turquoise/5' : 'border-white/10 hover:border-white/20',
                          )}
                          onClick={() => fontUploadRef.current?.click()}
                        >
                          <p className="text-[11px] text-white/40">
                            Drop <span className="text-white/60 font-mono">.woff2</span> <span className="text-white/60 font-mono">.ttf</span> <span className="text-white/60 font-mono">.otf</span> files for custom fonts, or <span className="text-white/60 underline underline-offset-2">browse</span>
                          </p>
                          <input
                            ref={fontUploadRef}
                            type="file"
                            accept=".woff,.woff2,.ttf,.otf,.eot"
                            multiple
                            className="hidden"
                            onChange={e => {
                              const files = Array.from(e.target.files || [])
                              Promise.all(files.map(async f => {
                                const reader = new FileReader()
                                return new Promise<{ name: string; file: string }>(resolve => {
                                  reader.onload = () => resolve({ name: f.name, file: reader.result as string })
                                  reader.readAsDataURL(f)
                                })
                              })).then(results => setUploadedFonts(prev => [...prev, ...results]))
                              e.target.value = ''
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Summary of loaded brand — shown after import */}
              {hasKit && name && (
                <div className="rounded-xl border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Loaded brand</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => window.open('/create/brand-preview', '_blank')}
                        className="text-[10px] text-turquoise hover:text-turquoise/80 transition-colors flex items-center gap-1"
                      >
                        Preview
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </button>
                      <span className="text-[10px] text-turquoise">Active</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    {description && <p className="text-xs text-white/50 mt-0.5">{description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-white/40">
                    {primaryColors.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          {[...primaryColors, ...secondaryColors].slice(0, 6).map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} />
                          ))}
                        </div>
                        <span>{primaryColors.length + secondaryColors.length + neutralColors.length} colors</span>
                      </div>
                    )}
                    {displayFont && <span>Display: {displayFont}</span>}
                    {illustrations.length > 0 && <span>{illustrations.length} illustrations</span>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <div>
            {hasKit && (
              <button type="button" onClick={handleDelete} className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                Reset to default (Félix)
              </button>
            )}
          </div>
          <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
