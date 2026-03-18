'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────── Types ─────────────────────── */

export interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'pdf' | 'data'
  data: string // base64 data URL or raw text for data files
  size: number
  preview?: string
}

export interface FileUploaderProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
}

/* ─────────────────────── Constants ─────────────────────── */

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const PDF_TYPES = ['application/pdf']
const DATA_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'application/json',
  'text/tab-separated-values',
]
const DATA_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.json', '.txt', '.tsv', '.docx', '.doc']

const ACCEPT = [
  ...IMAGE_TYPES,
  ...PDF_TYPES,
  ...DATA_TYPES,
  ...DATA_EXTENSIONS,
].join(',')

const MAX_SIZE = 10 * 1024 * 1024

function generateId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileCategory(file: File): 'image' | 'pdf' | 'data' | null {
  if (IMAGE_TYPES.includes(file.type)) return 'image'
  if (PDF_TYPES.includes(file.type)) return 'pdf'
  if (DATA_TYPES.includes(file.type)) return 'data'
  // Check extension as fallback
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (DATA_EXTENSIONS.includes(ext)) return 'data'
  return null
}

async function parseExcelToCSV(buffer: ArrayBuffer): Promise<string> {
  const XLSX = (await import('xlsx')).default
  const workbook = XLSX.read(buffer)
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name]
    const csv = XLSX.utils.sheet_to_csv(sheet)
    return workbook.SheetNames.length > 1
      ? `=== Sheet: ${name} ===\n${csv}`
      : csv
  }).join('\n\n')
}

async function parseDocxToText(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}

/* ─────────────────────── Shared file processing ─────────────────────── */

export { ACCEPT, MAX_SIZE }

export async function processFileToUpload(file: File): Promise<UploadedFile | null> {
  if (file.size > MAX_SIZE) return null
  const category = getFileCategory(file)
  if (!category) return null

  try {
    if (category === 'data') {
      const ext = file.name.split('.').pop()?.toLowerCase()
      let text: string
      if (ext === 'xlsx' || ext === 'xls') {
        text = await parseExcelToCSV(await file.arrayBuffer())
      } else if (ext === 'docx' || ext === 'doc') {
        text = await parseDocxToText(await file.arrayBuffer())
      } else {
        text = await file.text()
      }
      return { id: generateId(), name: file.name, type: 'data', data: text, size: file.size }
    } else {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve({
          id: generateId(), name: file.name, type: category,
          data: reader.result as string, size: file.size,
          preview: category === 'image' ? (reader.result as string) : undefined,
        })
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      })
    }
  } catch {
    return null
  }
}

/* ─────────────────────── Component ─────────────────────── */

export function FileUploader({ files, onFilesChange, maxFiles = 10 }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File): Promise<UploadedFile | null> => {
    return new Promise(async (resolve) => {
      if (file.size > MAX_SIZE) {
        setError(`${file.name} exceeds 10MB limit`)
        resolve(null)
        return
      }

      const category = getFileCategory(file)
      if (!category) {
        setError(`${file.name} is not a supported file type`)
        resolve(null)
        return
      }

      try {
        if (category === 'data') {
          // Parse data files to text
          const ext = file.name.split('.').pop()?.toLowerCase()
          let text: string

          if (ext === 'xlsx' || ext === 'xls') {
            const buffer = await file.arrayBuffer()
            text = await parseExcelToCSV(buffer)
          } else if (ext === 'docx' || ext === 'doc') {
            const buffer = await file.arrayBuffer()
            text = await parseDocxToText(buffer)
          } else {
            text = await file.text()
          }

          resolve({
            id: generateId(),
            name: file.name,
            type: 'data',
            data: text,
            size: file.size,
          })
        } else {
          // Read as base64 for images and PDFs
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              id: generateId(),
              name: file.name,
              type: category,
              data: reader.result as string,
              size: file.size,
              preview: category === 'image' ? (reader.result as string) : undefined,
            })
          }
          reader.onerror = () => {
            setError(`Failed to read ${file.name}`)
            resolve(null)
          }
          reader.readAsDataURL(file)
        }
      } catch {
        setError(`Failed to process ${file.name}`)
        resolve(null)
      }
    })
  }, [])

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    setError(null)
    const remaining = maxFiles - files.length
    if (remaining <= 0) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const toProcess = Array.from(fileList).slice(0, remaining)
    const results = await Promise.all(toProcess.map(processFile))
    const valid = results.filter(Boolean) as UploadedFile[]

    if (valid.length > 0) {
      onFilesChange([...files, ...valid])
    }
  }, [files, maxFiles, onFilesChange, processFile])

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }, [files, onFilesChange])

  return (
    <div className="bg-slate-950 rounded-2xl border border-white/10 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Reference Files
        </label>
        <span className="text-xs text-white/30">
          {files.length} / {maxFiles}
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }}
        onDrop={(e) => {
          e.preventDefault(); e.stopPropagation(); setDragOver(false)
          if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'w-full rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer',
          dragOver
            ? 'border-turquoise bg-turquoise/5'
            : 'border-white/20 hover:border-turquoise/50 hover:bg-white/[0.02]',
          files.length >= maxFiles && 'opacity-50 pointer-events-none',
        )}
      >
        <Upload className={cn('w-8 h-8 transition-colors', dragOver ? 'text-turquoise' : 'text-white/30')} />
        <div className="text-center">
          <p className="text-sm text-white/60">
            Drop files here, or click to browse
          </p>
          <p className="text-xs text-white/30 mt-1">
            Images, PDF, Word, CSV, Excel, JSON, TXT &middot; Max 10MB each
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
        className="hidden"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {files.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin scrollbar-thumb-white/10">
          {files.map((file) => (
            <div key={file.id} className="relative flex-shrink-0 group">
              {file.type === 'image' && file.preview ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1.5">
                  {file.type === 'data' ? (
                    <FileSpreadsheet className="w-6 h-6 text-cactus/60" />
                  ) : (
                    <FileText className="w-6 h-6 text-white/40" />
                  )}
                  <span className="text-[10px] text-white/40 px-1 truncate max-w-full">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-400"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>

              <p className="text-[10px] text-white/30 mt-1 truncate max-w-[80px] text-center">{file.name}</p>
              <p className="text-[9px] text-white/20 truncate max-w-[80px] text-center">{formatSize(file.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
