'use client'

import { useState, useEffect } from 'react'

const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_PRESO_PASSWORD || 'felix2026andbeyond!'

export function PresentationPassword({
  children,
  password,
  storageKey = 'felix-preso-auth',
}: {
  children: React.ReactNode
  password?: string
  storageKey?: string
}) {
  const PASSWORD = password ?? DEFAULT_PASSWORD
  const [authenticated, setAuthenticated] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey)
    if (stored === PASSWORD) setAuthenticated(true)
    setChecking(false)
  }, [PASSWORD, storageKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(storageKey, PASSWORD)
      setAuthenticated(true)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  if (checking) return null

  if (authenticated) return <>{children}</>

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 max-w-sm w-full px-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-display font-black text-linen text-2xl tracking-tight">Felix</span>
          <span className="text-linen/30 text-sm">Presentations</span>
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          autoFocus
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-linen text-center font-medium placeholder:text-linen/20 focus:outline-none focus:ring-2 focus:ring-turquoise/50 transition-colors ${
            error ? 'border-red-500/60 bg-red-500/5' : 'border-white/10'
          }`}
        />
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-xl bg-turquoise text-slate-950 font-display font-bold text-sm hover:bg-turquoise/90 transition-colors"
        >
          Enter
        </button>
        {error && (
          <p className="text-red-400 text-sm animate-in fade-in duration-200">Incorrect password</p>
        )}
      </form>
    </div>
  )
}
