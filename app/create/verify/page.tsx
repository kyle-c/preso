'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('No verification token found.')
      return
    }

    async function verify() {
      try {
        const res = await fetch('/api/studio/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          setError(data.error || 'Verification failed')
          return
        }

        setStatus('success')
        setTimeout(() => router.push('/create'), 2000)
      } catch {
        setStatus('error')
        setError('Network error. Please try again.')
      }
    }

    verify()
  }, [token, router])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 text-turquoise animate-spin mx-auto mb-6" />
            <h1 className="font-display font-black text-2xl text-white mb-2">
              Verifying your email...
            </h1>
            <p className="text-sm text-white/50">Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-turquoise mx-auto mb-6" />
            <h1 className="font-display font-black text-2xl text-white mb-2">
              Email verified!
            </h1>
            <p className="text-sm text-white/50">
              Redirecting you to Felix Studio...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-papaya mx-auto mb-6" />
            <h1 className="font-display font-black text-2xl text-white mb-2">
              Verification failed
            </h1>
            <p className="text-sm text-white/50 mb-6">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/create')}
              className="px-6 py-2.5 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  )
}
