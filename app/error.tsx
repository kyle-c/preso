'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40 }}>
      <h2 style={{ color: '#c00' }}>Page Error</h2>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 14 }}>
        {error.message}
        {'\n\n'}
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  )
}
