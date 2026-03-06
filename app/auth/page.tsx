'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(next)
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl tracking-tight mb-2">
            Password Required
          </h1>
          <p className="text-muted-foreground text-sm">
            This content is password{'\u00A0'}protected.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="Enter password"
              autoFocus
              className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-turquoise transition-colors ${
                error ? 'border-papaya ring-1 ring-papaya' : 'border-border'
              }`}
            />
            {error && (
              <p className="text-papaya text-sm mt-2">Wrong password. Try{'\u00A0'}again.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-slate text-linen font-display font-extrabold text-base py-3 transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
