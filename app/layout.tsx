import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { appendFileSync } from 'fs'

// #region agent log
try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:5',message:'Layout imports loaded',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
// #endregion

// #region agent log
try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:8',message:'Before font loading',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
// #endregion
const _geist = Geist({ subsets: ["latin"] });
// #region agent log
try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:10',message:'Geist font loaded',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
// #endregion
const _geistMono = Geist_Mono({ subsets: ["latin"] });
// #region agent log
try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:12',message:'GeistMono font loaded',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
// #endregion

export const metadata: Metadata = {
  title: 'chat prototype',
  description: 'Created with v0',
  generator: 'v0.app',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // #region agent log
  try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:28',message:'RootLayout render entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
  // #endregion
  try {
    // #region agent log
    try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:32',message:'Before JSX return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
    // #endregion
    return (
      <html lang="en">
        <body className={`font-sans antialiased`}>
          {children}
          <Analytics />
        </body>
      </html>
    )
  } catch (error) {
    // #region agent log
    try{appendFileSync('/Users/homeworld/Code/chat-prototype/.cursor/debug.log',JSON.stringify({location:'app/layout.tsx:42',message:'RootLayout ERROR',data:{error:String(error),stack:error instanceof Error?error.stack:''},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n');}catch(e){}
    // #endregion
    throw error
  }
}
