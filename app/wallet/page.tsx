'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import {
  Plus,
  ArrowDownLeft,
  Send,
  MoreHorizontal,
  HelpCircle,
  LogOut,
  Info,
  Signal,
  Wifi,
  Battery,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'

// ─── Theme ───────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

const t = {
  dark: {
    statusBg: 'bg-slate-950',
    statusText: 'text-linen',
    screenBg: 'bg-slate-950',
    homeIndicator: 'bg-linen/20',
    logo: 'text-linen',
    pill: 'bg-evergreen text-linen',
    headerIcon: 'text-linen/60',
    accountLabel: 'text-turquoise',
    balance: 'text-linen',
    rate: 'text-turquoise',
    rateIcon: 'text-turquoise',
    sparkStroke: '#2BF2F1',
    sparkFill: '#2BF2F1',
    actionBg: 'bg-turquoise/15',
    actionIcon: 'text-turquoise',
    actionLabel: 'text-linen/70',
    sectionTitle: 'text-linen',
    sectionLink: 'text-turquoise',
    txIconBg: 'bg-evergreen/40',
    txIcon: 'text-turquoise',
    txTitle: 'text-linen',
    txDate: 'text-linen/50',
    txBorder: 'border-evergreen/20',
    sparkGradId: 'sparkGradDark',
  },
  light: {
    statusBg: 'bg-linen',
    statusText: 'text-slate',
    screenBg: 'bg-linen',
    homeIndicator: 'bg-slate',
    logo: 'text-slate',
    pill: 'bg-turquoise text-slate',
    headerIcon: 'text-slate/50',
    accountLabel: 'text-evergreen',
    balance: 'text-slate',
    rate: 'text-evergreen',
    rateIcon: 'text-evergreen',
    sparkStroke: '#35605F',
    sparkFill: '#35605F',
    actionBg: 'bg-evergreen/10',
    actionIcon: 'text-evergreen',
    actionLabel: 'text-slate/60',
    sectionTitle: 'text-slate',
    sectionLink: 'text-evergreen',
    txIconBg: 'bg-turquoise/20',
    txIcon: 'text-evergreen',
    txTitle: 'text-slate',
    txDate: 'text-slate/50',
    txBorder: 'border-slate/10',
    sparkGradId: 'sparkGradLight',
  },
} as const

// ─── Language ────────────────────────────────────────────────────────────────

type Lang = 'es' | 'en'

const i18n = {
  es: {
    accountLabel: 'Ahorros con Acceso Instantáneo',
    rate: '4.00% Anual',
    actions: ['Agregar', 'Retirar', 'Enviar', 'Más'] as const,
    recentTitle: 'Movimientos Recientes',
    viewAll: 'Ver todo',
    transactions: [
      { icon: ArrowUpRight, title: 'Transferencia a María', date: '28 Feb 2026', amount: '$500.00', positive: false },
      { icon: TrendingUp, title: 'Intereses Ganados', date: '27 Feb 2026', amount: '$26.64', positive: true },
      { icon: ArrowDownLeft, title: 'Depósito Nómina', date: '25 Feb 2026', amount: '$3,200.00', positive: true },
      { icon: ArrowUpRight, title: 'Pago de Servicios', date: '23 Feb 2026', amount: '$185.50', positive: false },
      { icon: TrendingUp, title: 'Intereses Ganados', date: '20 Feb 2026', amount: '$24.12', positive: true },
    ],
  },
  en: {
    accountLabel: 'Instant Access Savings',
    rate: '4.00% Annual',
    actions: ['Add', 'Withdraw', 'Send', 'More'] as const,
    recentTitle: 'Recent Activity',
    viewAll: 'View all',
    transactions: [
      { icon: ArrowUpRight, title: 'Transfer to María', date: '28 Feb 2026', amount: '$500.00', positive: false },
      { icon: TrendingUp, title: 'Interest Earned', date: '27 Feb 2026', amount: '$26.64', positive: true },
      { icon: ArrowDownLeft, title: 'Payroll Deposit', date: '25 Feb 2026', amount: '$3,200.00', positive: true },
      { icon: ArrowUpRight, title: 'Bill Payment', date: '23 Feb 2026', amount: '$185.50', positive: false },
      { icon: TrendingUp, title: 'Interest Earned', date: '20 Feb 2026', amount: '$24.12', positive: true },
    ],
  },
} as const

// ─── Phone frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  const c = t[theme]
  return (
    <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />

      {/* Status Bar */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] ${c.statusBg}`}>
        <span className={`text-[15px] font-semibold ${c.statusText}`}>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className={`h-3.5 w-3.5 ${c.statusText}`} />
          <Wifi className={`h-3.5 w-3.5 ${c.statusText}`} />
          <Battery className={`h-3.5 w-3.5 ${c.statusText}`} />
        </div>
      </div>

      {/* Screen Content */}
      <div className={`h-full w-full overflow-y-auto ${c.screenBg} pt-[54px] pb-[34px]`}>
        {children}
      </div>

      {/* Home Indicator */}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full ${c.homeIndicator}`} />
    </div>
  )
}

// ─── Sparkline chart ─────────────────────────────────────────────────────────

function Sparkline({ theme }: { theme: Theme }) {
  const c = t[theme]
  const points = [
    [0, 70], [15, 65], [30, 68], [50, 55], [70, 58], [90, 48],
    [110, 52], [130, 42], [155, 45], [180, 35], [200, 38], [220, 30],
    [245, 28], [265, 25], [280, 22], [300, 18], [320, 15], [340, 12],
  ]

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  const areaD = `${lineD} L340,80 L0,80 Z`

  return (
    <svg viewBox="0 0 340 80" className="w-full h-[100px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id={c.sparkGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.sparkFill} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.sparkFill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${c.sparkGradId})`} />
      <path d={lineD} fill="none" stroke={c.sparkStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Quick action button ─────────────────────────────────────────────────────

function QuickAction({ icon: Icon, label, theme }: { icon: React.ElementType; label: string; theme: Theme }) {
  const c = t[theme]
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex items-center justify-center w-[52px] h-[52px] rounded-full ${c.actionBg}`}>
        <Icon className={`h-5 w-5 ${c.actionIcon}`} />
      </div>
      <span className={`${c.actionLabel} text-[12px]`}>{label}</span>
    </div>
  )
}

// ─── Transaction row ─────────────────────────────────────────────────────────

function TransactionRow({
  icon: Icon,
  title,
  date,
  amount,
  positive,
  theme,
}: {
  icon: React.ElementType
  title: string
  date: string
  amount: string
  positive: boolean
  theme: Theme
}) {
  const c = t[theme]
  return (
    <div className={`flex items-center gap-3 py-3.5 border-b ${c.txBorder}`}>
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${c.txIconBg} shrink-0`}>
        <Icon className={`h-4.5 w-4.5 ${c.txIcon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${c.txTitle} text-[14px] font-medium truncate`}>{title}</p>
        <p className={`${c.txDate} text-[12px]`}>{date}</p>
      </div>
      <span className={`text-[14px] font-semibold ${positive ? 'text-cactus' : 'text-papaya'}`}>
        {positive ? '+' : '-'}{amount}
      </span>
    </div>
  )
}

// ─── Wallet screen ───────────────────────────────────────────────────────────

const actionIcons = [Plus, ArrowDownLeft, Send, MoreHorizontal] as const

function WalletScreen({ theme }: { theme: Theme }) {
  const c = t[theme]
  const [lang, setLang] = useState<Lang>('es')
  const s = i18n[lang]

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-baseline gap-1.5">
          <FelixLogo className={`h-7 ${c.logo}`} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className={`${c.pill} text-[11px] font-bold px-2.5 py-1 rounded-full transition-transform active:scale-90`}
          >
            {lang.toUpperCase()}
          </button>
          <HelpCircle className={`h-5 w-5 ${c.headerIcon}`} />
          <LogOut className={`h-5 w-5 ${c.headerIcon}`} />
        </div>
      </div>

      {/* Account label */}
      <div className="px-5 pt-3">
        <p className={`${c.accountLabel} text-[13px]`}>{s.accountLabel}</p>
      </div>

      {/* Balance */}
      <div className="px-5 pt-1.5">
        <h1 className={`font-display text-[44px] font-extrabold ${c.balance} leading-tight`}>
          $7,994.76
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`${c.rate} text-[14px] font-medium`}>{s.rate}</span>
          <Info className={`h-3.5 w-3.5 ${c.rateIcon}`} />
        </div>
      </div>

      {/* Sparkline */}
      <div className="px-5 pt-4 pb-2">
        <Sparkline theme={theme} />
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between px-8 py-5">
        {actionIcons.map((icon, idx) => (
          <QuickAction key={idx} icon={icon} label={s.actions[idx]} theme={theme} />
        ))}
      </div>

      {/* Transactions */}
      <div className="flex-1 px-5 pt-2 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`${c.sectionTitle} text-[16px] font-semibold`}>{s.recentTitle}</h2>
          <span className={`${c.sectionLink} text-[13px] font-medium`}>{s.viewAll}</span>
        </div>

        {s.transactions.map((tx) => (
          <TransactionRow key={tx.title + tx.date} {...tx} theme={theme} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  return (
    <div className="relative min-h-screen bg-stone flex items-center justify-center gap-12 py-12 px-8 overflow-hidden">
      {/* Decorative illustrations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Rocket — bottom right (anchor) */}
        <div className="absolute bottom-0 right-0 w-[400px] lg:w-[520px] opacity-[0.18]" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Cloud coin — top left */}
        <div className="absolute top-[8%] left-[4%] w-[110px] lg:w-[140px] opacity-[0.16] -rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Small lime coin — top right */}
        <div className="absolute top-[10%] right-[8%] w-[40px] lg:w-[50px] opacity-[0.2]" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Paper airplane — bottom left */}
        <div className="absolute bottom-[6%] left-[3%] w-[150px] lg:w-[190px] opacity-[0.14] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Phone frames */}
      <div className="relative z-10 flex items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <span className="text-slate/60 text-sm font-medium tracking-wide uppercase">Dark</span>
          <PhoneFrame theme="dark">
            <WalletScreen theme="dark" />
          </PhoneFrame>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="text-slate/60 text-sm font-medium tracking-wide uppercase">Light</span>
          <PhoneFrame theme="light">
            <WalletScreen theme="light" />
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
}
