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

const c = {
  statusBg: 'bg-linen',
  statusText: 'text-slate',
  screenBg: 'bg-linen',
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
}

const transactions = [
  { icon: ArrowUpRight, title: 'Transferencia a Maria', date: '28 Feb 2026', amount: '$500.00', positive: false },
  { icon: TrendingUp, title: 'Intereses Ganados', date: '27 Feb 2026', amount: '$26.64', positive: true },
  { icon: ArrowDownLeft, title: 'Deposito Nomina', date: '25 Feb 2026', amount: '$3,200.00', positive: true },
  { icon: ArrowUpRight, title: 'Pago de Servicios', date: '23 Feb 2026', amount: '$185.50', positive: false },
  { icon: TrendingUp, title: 'Intereses Ganados', date: '20 Feb 2026', amount: '$24.12', positive: true },
]

const actionIcons = [Plus, ArrowDownLeft, Send, MoreHorizontal] as const
const actionLabels = ['Agregar', 'Retirar', 'Enviar', 'Mas'] as const

function Sparkline() {
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
        <linearGradient id="sparkGradEmbed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.sparkFill} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.sparkFill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkGradEmbed)" />
      <path d={lineD} fill="none" stroke={c.sparkStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function WalletEmbed() {
  return (
    <div className="w-[390px] h-[844px] bg-linen overflow-hidden relative">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-baseline gap-1.5">
            <FelixLogo className={`h-7 ${c.logo}`} />
          </div>
          <div className="flex items-center gap-3">
            <span className={`${c.pill} text-[11px] font-bold px-2.5 py-1 rounded-full`}>ES</span>
            <HelpCircle className={`h-5 w-5 ${c.headerIcon}`} />
            <LogOut className={`h-5 w-5 ${c.headerIcon}`} />
          </div>
        </div>

        {/* Account label */}
        <div className="px-5 pt-3">
          <p className={`${c.accountLabel} text-[13px]`}>Ahorros con Acceso Instantaneo</p>
        </div>

        {/* Balance */}
        <div className="px-5 pt-1.5">
          <h1 className={`font-display text-[44px] font-extrabold ${c.balance} leading-tight`}>$7,994.76</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`${c.rate} text-[14px] font-medium`}>4.00% Anual</span>
            <Info className={`h-3.5 w-3.5 ${c.rateIcon}`} />
          </div>
        </div>

        {/* Sparkline */}
        <div className="px-5 pt-4 pb-2">
          <Sparkline />
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between px-8 py-5">
          {actionIcons.map((Icon, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className={`flex items-center justify-center w-[52px] h-[52px] rounded-full ${c.actionBg}`}>
                <Icon className={`h-5 w-5 ${c.actionIcon}`} />
              </div>
              <span className={`${c.actionLabel} text-[12px]`}>{actionLabels[idx]}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="px-5 pt-2 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`${c.sectionTitle} text-[16px] font-semibold`}>Movimientos Recientes</h2>
            <span className={`${c.sectionLink} text-[13px] font-medium`}>Ver todo</span>
          </div>
          {transactions.map((tx) => (
            <div key={tx.title + tx.date} className={`flex items-center gap-3 py-3.5 border-b ${c.txBorder}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${c.txIconBg} shrink-0`}>
                <tx.icon className={`h-4.5 w-4.5 ${c.txIcon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${c.txTitle} text-[14px] font-medium truncate`}>{tx.title}</p>
                <p className={`${c.txDate} text-[12px]`}>{tx.date}</p>
              </div>
              <span className={`text-[14px] font-semibold ${tx.positive ? 'text-cactus' : 'text-papaya'}`}>
                {tx.positive ? '+' : '-'}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
