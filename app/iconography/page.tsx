'use client'

import { useState } from 'react'
import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { Section } from '@/components/design-system/section'
import type { IconProps } from '@phosphor-icons/react'

import {
  // Navigation & Actions
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft,
  ArrowsLeftRight, CaretLeft, CaretRight, CaretDown, CaretUp,
  X, Check, Plus, Minus, DotsThree, DotsThreeVertical,

  // Finance & Commerce
  Wallet, Bank, CreditCard, Money, CurrencyDollar, CurrencyCircleDollar,
  Coins, Receipt, Invoice, Percent, ChartLineUp, ChartBar,
  TrendUp, TrendDown, Vault, PiggyBank, HandCoins,

  // Communication
  PaperPlaneTilt, ChatCircle, ChatDots, EnvelopeSimple,
  Bell, BellRinging, Megaphone, Phone, WhatsappLogo,

  // User & Identity
  User, UserCircle, Users, IdentificationCard, Fingerprint,
  Shield, ShieldCheck, Lock, LockOpen, Key, SignIn, SignOut,

  // Interface & UI
  House, Gear, MagnifyingGlass, FunnelSimple, SlidersHorizontal,
  ListIcon, SquaresFour, Eye, EyeSlash, Copy, Share,
  DownloadSimple, UploadSimple, Trash, PencilSimple, QrCode, Camera, ImageIcon,

  // Status & Feedback
  Info, Question, Warning, WarningCircle, CheckCircle, XCircle,
  CircleNotch, SpinnerGap, Sparkle, Star, Heart, ThumbsUp,

  // Device & Connectivity
  DeviceMobile, Globe, WifiHigh, MapPin, Clock, CalendarBlank, Timer,

  // Documents & Content
  FileText, Files, Clipboard, Article, BookOpen, Notebook,

  // Misc
  Lightning, Rocket, Gift, Handshake, Lifebuoy, Flag, Tag,
} from '@/components-next/phosphor-icons'

// ─── Icon registry ───────────────────────────────────────────────────────────

type IconEntry = { name: string; Icon: React.ComponentType<IconProps> }

const categories: { label: string; icons: IconEntry[] }[] = [
  {
    label: 'Finance & Commerce',
    icons: [
      { name: 'Wallet', Icon: Wallet },
      { name: 'Bank', Icon: Bank },
      { name: 'CreditCard', Icon: CreditCard },
      { name: 'Money', Icon: Money },
      { name: 'CurrencyDollar', Icon: CurrencyDollar },
      { name: 'CurrencyCircleDollar', Icon: CurrencyCircleDollar },
      { name: 'Coins', Icon: Coins },
      { name: 'Receipt', Icon: Receipt },
      { name: 'Invoice', Icon: Invoice },
      { name: 'Percent', Icon: Percent },
      { name: 'ChartLineUp', Icon: ChartLineUp },
      { name: 'ChartBar', Icon: ChartBar },
      { name: 'TrendUp', Icon: TrendUp },
      { name: 'TrendDown', Icon: TrendDown },
      { name: 'Vault', Icon: Vault },
      { name: 'PiggyBank', Icon: PiggyBank },
      { name: 'HandCoins', Icon: HandCoins },
    ],
  },
  {
    label: 'Communication',
    icons: [
      { name: 'PaperPlaneTilt', Icon: PaperPlaneTilt },
      { name: 'ChatCircle', Icon: ChatCircle },
      { name: 'ChatDots', Icon: ChatDots },
      { name: 'EnvelopeSimple', Icon: EnvelopeSimple },
      { name: 'Bell', Icon: Bell },
      { name: 'BellRinging', Icon: BellRinging },
      { name: 'Megaphone', Icon: Megaphone },
      { name: 'Phone', Icon: Phone },
      { name: 'WhatsappLogo', Icon: WhatsappLogo },
    ],
  },
  {
    label: 'Navigation & Actions',
    icons: [
      { name: 'ArrowLeft', Icon: ArrowLeft },
      { name: 'ArrowRight', Icon: ArrowRight },
      { name: 'ArrowUp', Icon: ArrowUp },
      { name: 'ArrowDown', Icon: ArrowDown },
      { name: 'ArrowUpRight', Icon: ArrowUpRight },
      { name: 'ArrowDownLeft', Icon: ArrowDownLeft },
      { name: 'ArrowsLeftRight', Icon: ArrowsLeftRight },
      { name: 'CaretLeft', Icon: CaretLeft },
      { name: 'CaretRight', Icon: CaretRight },
      { name: 'CaretDown', Icon: CaretDown },
      { name: 'CaretUp', Icon: CaretUp },
      { name: 'X', Icon: X },
      { name: 'Check', Icon: Check },
      { name: 'Plus', Icon: Plus },
      { name: 'Minus', Icon: Minus },
      { name: 'DotsThree', Icon: DotsThree },
      { name: 'DotsThreeVertical', Icon: DotsThreeVertical },
    ],
  },
  {
    label: 'User & Identity',
    icons: [
      { name: 'User', Icon: User },
      { name: 'UserCircle', Icon: UserCircle },
      { name: 'Users', Icon: Users },
      { name: 'IdentificationCard', Icon: IdentificationCard },
      { name: 'Fingerprint', Icon: Fingerprint },
      { name: 'Shield', Icon: Shield },
      { name: 'ShieldCheck', Icon: ShieldCheck },
      { name: 'Lock', Icon: Lock },
      { name: 'LockOpen', Icon: LockOpen },
      { name: 'Key', Icon: Key },
      { name: 'SignIn', Icon: SignIn },
      { name: 'SignOut', Icon: SignOut },
    ],
  },
  {
    label: 'Interface & UI',
    icons: [
      { name: 'House', Icon: House },
      { name: 'Gear', Icon: Gear },
      { name: 'MagnifyingGlass', Icon: MagnifyingGlass },
      { name: 'FunnelSimple', Icon: FunnelSimple },
      { name: 'SlidersHorizontal', Icon: SlidersHorizontal },
      { name: 'List', Icon: ListIcon },
      { name: 'SquaresFour', Icon: SquaresFour },
      { name: 'Eye', Icon: Eye },
      { name: 'EyeSlash', Icon: EyeSlash },
      { name: 'Copy', Icon: Copy },
      { name: 'Share', Icon: Share },
      { name: 'DownloadSimple', Icon: DownloadSimple },
      { name: 'UploadSimple', Icon: UploadSimple },
      { name: 'Trash', Icon: Trash },
      { name: 'PencilSimple', Icon: PencilSimple },
      { name: 'QrCode', Icon: QrCode },
      { name: 'Camera', Icon: Camera },
      { name: 'Image', Icon: ImageIcon },
    ],
  },
  {
    label: 'Status & Feedback',
    icons: [
      { name: 'Info', Icon: Info },
      { name: 'Question', Icon: Question },
      { name: 'Warning', Icon: Warning },
      { name: 'WarningCircle', Icon: WarningCircle },
      { name: 'CheckCircle', Icon: CheckCircle },
      { name: 'XCircle', Icon: XCircle },
      { name: 'CircleNotch', Icon: CircleNotch },
      { name: 'SpinnerGap', Icon: SpinnerGap },
      { name: 'Sparkle', Icon: Sparkle },
      { name: 'Star', Icon: Star },
      { name: 'Heart', Icon: Heart },
      { name: 'ThumbsUp', Icon: ThumbsUp },
    ],
  },
  {
    label: 'Device & Connectivity',
    icons: [
      { name: 'DeviceMobile', Icon: DeviceMobile },
      { name: 'Globe', Icon: Globe },
      { name: 'WifiHigh', Icon: WifiHigh },
      { name: 'MapPin', Icon: MapPin },
      { name: 'Clock', Icon: Clock },
      { name: 'CalendarBlank', Icon: CalendarBlank },
      { name: 'Timer', Icon: Timer },
    ],
  },
  {
    label: 'Documents & Content',
    icons: [
      { name: 'FileText', Icon: FileText },
      { name: 'Files', Icon: Files },
      { name: 'Clipboard', Icon: Clipboard },
      { name: 'Article', Icon: Article },
      { name: 'BookOpen', Icon: BookOpen },
      { name: 'Notebook', Icon: Notebook },
    ],
  },
  {
    label: 'Misc',
    icons: [
      { name: 'Lightning', Icon: Lightning },
      { name: 'Rocket', Icon: Rocket },
      { name: 'Gift', Icon: Gift },
      { name: 'Handshake', Icon: Handshake },
      { name: 'Lifebuoy', Icon: Lifebuoy },
      { name: 'Flag', Icon: Flag },
      { name: 'Tag', Icon: Tag },
    ],
  },
]

// ─── Icon tile ───────────────────────────────────────────────────────────────

function IconTile({ name, Icon, size }: { name: string; Icon: React.ComponentType<IconProps>; size: number }) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(name)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-transparent hover:border-border hover:bg-white/60 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-stone group-hover:bg-turquoise/10 transition-colors">
        <Icon size={size} className="text-slate group-hover:text-evergreen transition-colors" />
      </div>
      <span className={`text-[11px] font-mono leading-tight text-center transition-colors ${copied ? 'text-cactus font-semibold' : 'text-muted-foreground'}`}>
        {copied ? 'Copied!' : name}
      </span>
    </button>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IconsPage() {
  const [search, setSearch] = useState('')
  const [size, setSize] = useState(28)
  const [showImport, setShowImport] = useState(false)

  const query = search.toLowerCase()

  const filtered = categories
    .map((cat) => ({
      ...cat,
      icons: cat.icons.filter((i) => i.name.toLowerCase().includes(query)),
    }))
    .filter((cat) => cat.icons.length > 0)

  const totalCount = filtered.reduce((sum, cat) => sum + cat.icons.length, 0)

  return (
    <DesignSystemLayout title="Iconography" description="A curated set of duotone icons for the Felix design system. The two-tone layering pairs naturally with our illustration style and tinted UI patterns. Click any icon to copy its import name.">
      <Section
        id="icons"
        title=""
      >
        {/* Controls */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise/30 focus:border-turquoise"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <label htmlFor="icon-size">Size</label>
            <input
              id="icon-size"
              type="range"
              min={16}
              max={48}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24 accent-turquoise"
            />
            <span className="font-mono text-xs w-6">{size}</span>
          </div>
          <span className="text-sm text-muted-foreground">{totalCount} icons</span>
          <button
            onClick={() => setShowImport(!showImport)}
            className="ml-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
          >
            <FileText size={16} className="shrink-0" />
            Import path
          </button>
        </div>

        {/* Import snippet — collapsible */}
        {showImport && (
          <button
            onClick={() => setShowImport(false)}
            className="mb-4 w-full p-4 rounded-lg bg-slate-950 text-linen font-mono text-sm text-left transition-all hover:bg-slate-900 cursor-pointer"
          >
            <span className="text-turquoise">import</span>{' '}
            {'{ Wallet, PaperPlaneTilt }'}{' '}
            <span className="text-turquoise">from</span>{' '}
            <span className="text-lime">&apos;@/components-next/phosphor-icons&apos;</span>
          </button>
        )}

        {/* Icon grid by category */}
        {filtered.map((cat) => (
          <div key={cat.label} className="mb-10">
            <h3 className="font-display font-bold text-foreground text-lg mb-4">{cat.label}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1">
              {cat.icons.map(({ name, Icon }) => (
                <IconTile key={name} name={name} Icon={Icon} size={size} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No icons match &ldquo;{search}&rdquo;</p>
        )}
      </Section>
    </DesignSystemLayout>
  )
}
