/**
 * Phosphor Icons — Duotone weight
 *
 * Wraps Phosphor's SSR-safe icons with weight="duotone" as the default.
 * The two-tone layering mirrors our tinted-bg + accent-icon patterns and
 * pairs naturally with the Felix illustration style.
 *
 * Usage:
 *   import { Wallet, PaperPlaneTilt } from '@/components-next/phosphor-icons'
 *   <Wallet size={24} className="text-turquoise" />
 *
 * Browse the full set: https://phosphoricons.com/?weight=duotone
 */

import type { IconProps } from '@phosphor-icons/react'
import {
  // Navigation & Actions
  ArrowLeft as _ArrowLeft,
  ArrowRight as _ArrowRight,
  ArrowUp as _ArrowUp,
  ArrowDown as _ArrowDown,
  ArrowUpRight as _ArrowUpRight,
  ArrowDownLeft as _ArrowDownLeft,
  ArrowsLeftRight as _ArrowsLeftRight,
  CaretLeft as _CaretLeft,
  CaretRight as _CaretRight,
  CaretDown as _CaretDown,
  CaretUp as _CaretUp,
  X as _X,
  Check as _Check,
  Plus as _Plus,
  Minus as _Minus,
  DotsThree as _DotsThree,
  DotsThreeVertical as _DotsThreeVertical,

  // Finance & Commerce
  Wallet as _Wallet,
  Bank as _Bank,
  CreditCard as _CreditCard,
  Money as _Money,
  CurrencyDollar as _CurrencyDollar,
  CurrencyCircleDollar as _CurrencyCircleDollar,
  Coins as _Coins,
  Receipt as _Receipt,
  Invoice as _Invoice,
  Percent as _Percent,
  ChartLineUp as _ChartLineUp,
  ChartBar as _ChartBar,
  TrendUp as _TrendUp,
  TrendDown as _TrendDown,
  Vault as _Vault,
  PiggyBank as _PiggyBank,
  HandCoins as _HandCoins,

  // Communication
  PaperPlaneTilt as _PaperPlaneTilt,
  ChatCircle as _ChatCircle,
  ChatDots as _ChatDots,
  EnvelopeSimple as _EnvelopeSimple,
  Bell as _Bell,
  BellRinging as _BellRinging,
  Megaphone as _Megaphone,
  Phone as _Phone,
  WhatsappLogo as _WhatsappLogo,

  // User & Identity
  User as _User,
  UserCircle as _UserCircle,
  Users as _Users,
  IdentificationCard as _IdentificationCard,
  Fingerprint as _Fingerprint,
  Shield as _Shield,
  ShieldCheck as _ShieldCheck,
  Lock as _Lock,
  LockOpen as _LockOpen,
  Key as _Key,
  SignIn as _SignIn,
  SignOut as _SignOut,

  // Interface & UI
  House as _House,
  Gear as _Gear,
  MagnifyingGlass as _MagnifyingGlass,
  FunnelSimple as _FunnelSimple,
  SlidersHorizontal as _SlidersHorizontal,
  List as _List,
  SquaresFour as _SquaresFour,
  Eye as _Eye,
  EyeSlash as _EyeSlash,
  Copy as _Copy,
  Share as _Share,
  DownloadSimple as _DownloadSimple,
  UploadSimple as _UploadSimple,
  Trash as _Trash,
  PencilSimple as _PencilSimple,
  QrCode as _QrCode,
  Camera as _Camera,
  Image as _Image,

  // Status & Feedback
  Info as _Info,
  Question as _Question,
  Warning as _Warning,
  WarningCircle as _WarningCircle,
  CheckCircle as _CheckCircle,
  XCircle as _XCircle,
  CircleNotch as _CircleNotch,
  SpinnerGap as _SpinnerGap,
  Sparkle as _Sparkle,
  Star as _Star,
  Heart as _Heart,
  ThumbsUp as _ThumbsUp,

  // Device & Connectivity
  DeviceMobile as _DeviceMobile,
  Globe as _Globe,
  WifiHigh as _WifiHigh,
  CellSignalFull as _CellSignalFull,
  BatteryFull as _BatteryFull,
  MapPin as _MapPin,
  Clock as _Clock,
  CalendarBlank as _CalendarBlank,
  Timer as _Timer,

  // Documents & Content
  FileText as _FileText,
  Files as _Files,
  Clipboard as _Clipboard,
  Article as _Article,
  BookOpen as _BookOpen,
  Notebook as _Notebook,

  // Misc
  Lightning as _Lightning,
  Rocket as _Rocket,
  Gift as _Gift,
  Handshake as _Handshake,
  Lifebuoy as _Lifebuoy,
  Flag as _Flag,
  Tag as _Tag,
  Pause as _Pause,
  HandPalm as _HandPalm,
  Prohibit as _Prohibit,
} from '@phosphor-icons/react/dist/ssr'
import { forwardRef } from 'react'

// Helper: wrap a Phosphor icon so weight defaults to "duotone"
function duotone(Icon: React.ComponentType<IconProps>) {
  const Wrapped = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <Icon ref={ref} weight="duotone" {...props} />
  ))
  Wrapped.displayName = Icon.displayName
  return Wrapped
}

// Navigation & Actions
export const ArrowLeft = duotone(_ArrowLeft)
export const ArrowRight = duotone(_ArrowRight)
export const ArrowUp = duotone(_ArrowUp)
export const ArrowDown = duotone(_ArrowDown)
export const ArrowUpRight = duotone(_ArrowUpRight)
export const ArrowDownLeft = duotone(_ArrowDownLeft)
export const ArrowsLeftRight = duotone(_ArrowsLeftRight)
export const CaretLeft = duotone(_CaretLeft)
export const CaretRight = duotone(_CaretRight)
export const CaretDown = duotone(_CaretDown)
export const CaretUp = duotone(_CaretUp)
export const X = duotone(_X)
export const Check = duotone(_Check)
export const Plus = duotone(_Plus)
export const Minus = duotone(_Minus)
export const DotsThree = duotone(_DotsThree)
export const DotsThreeVertical = duotone(_DotsThreeVertical)

// Finance & Commerce
export const Wallet = duotone(_Wallet)
export const Bank = duotone(_Bank)
export const CreditCard = duotone(_CreditCard)
export const Money = duotone(_Money)
export const CurrencyDollar = duotone(_CurrencyDollar)
export const CurrencyCircleDollar = duotone(_CurrencyCircleDollar)
export const Coins = duotone(_Coins)
export const Receipt = duotone(_Receipt)
export const Invoice = duotone(_Invoice)
export const Percent = duotone(_Percent)
export const ChartLineUp = duotone(_ChartLineUp)
export const ChartBar = duotone(_ChartBar)
export const TrendUp = duotone(_TrendUp)
export const TrendDown = duotone(_TrendDown)
export const Vault = duotone(_Vault)
export const PiggyBank = duotone(_PiggyBank)
export const HandCoins = duotone(_HandCoins)

// Communication
export const PaperPlaneTilt = duotone(_PaperPlaneTilt)
export const ChatCircle = duotone(_ChatCircle)
export const ChatDots = duotone(_ChatDots)
export const EnvelopeSimple = duotone(_EnvelopeSimple)
export const Bell = duotone(_Bell)
export const BellRinging = duotone(_BellRinging)
export const Megaphone = duotone(_Megaphone)
export const Phone = duotone(_Phone)
export const WhatsappLogo = duotone(_WhatsappLogo)

// User & Identity
export const User = duotone(_User)
export const UserCircle = duotone(_UserCircle)
export const Users = duotone(_Users)
export const IdentificationCard = duotone(_IdentificationCard)
export const Fingerprint = duotone(_Fingerprint)
export const Shield = duotone(_Shield)
export const ShieldCheck = duotone(_ShieldCheck)
export const Lock = duotone(_Lock)
export const LockOpen = duotone(_LockOpen)
export const Key = duotone(_Key)
export const SignIn = duotone(_SignIn)
export const SignOut = duotone(_SignOut)

// Interface & UI
export const House = duotone(_House)
export const Gear = duotone(_Gear)
export const MagnifyingGlass = duotone(_MagnifyingGlass)
export const FunnelSimple = duotone(_FunnelSimple)
export const SlidersHorizontal = duotone(_SlidersHorizontal)
export const ListIcon = duotone(_List)
export const SquaresFour = duotone(_SquaresFour)
export const Eye = duotone(_Eye)
export const EyeSlash = duotone(_EyeSlash)
export const Copy = duotone(_Copy)
export const Share = duotone(_Share)
export const DownloadSimple = duotone(_DownloadSimple)
export const UploadSimple = duotone(_UploadSimple)
export const Trash = duotone(_Trash)
export const PencilSimple = duotone(_PencilSimple)
export const QrCode = duotone(_QrCode)
export const Camera = duotone(_Camera)
export const ImageIcon = duotone(_Image)

// Status & Feedback
export const Info = duotone(_Info)
export const Question = duotone(_Question)
export const Warning = duotone(_Warning)
export const WarningCircle = duotone(_WarningCircle)
export const CheckCircle = duotone(_CheckCircle)
export const XCircle = duotone(_XCircle)
export const CircleNotch = duotone(_CircleNotch)
export const SpinnerGap = duotone(_SpinnerGap)
export const Sparkle = duotone(_Sparkle)
export const Star = duotone(_Star)
export const Heart = duotone(_Heart)
export const ThumbsUp = duotone(_ThumbsUp)

// Device & Connectivity
export const DeviceMobile = duotone(_DeviceMobile)
export const Globe = duotone(_Globe)
export const WifiHigh = duotone(_WifiHigh)
export const CellSignalFull = duotone(_CellSignalFull)
export const BatteryFull = duotone(_BatteryFull)
export const MapPin = duotone(_MapPin)
export const Clock = duotone(_Clock)
export const CalendarBlank = duotone(_CalendarBlank)
export const Timer = duotone(_Timer)

// Documents & Content
export const FileText = duotone(_FileText)
export const Files = duotone(_Files)
export const Clipboard = duotone(_Clipboard)
export const Article = duotone(_Article)
export const BookOpen = duotone(_BookOpen)
export const Notebook = duotone(_Notebook)

// Misc
export const Lightning = duotone(_Lightning)
export const Rocket = duotone(_Rocket)
export const Gift = duotone(_Gift)
export const Handshake = duotone(_Handshake)
export const Lifebuoy = duotone(_Lifebuoy)
export const Flag = duotone(_Flag)
export const Tag = duotone(_Tag)
export const Pause = duotone(_Pause)
export const HandPalm = duotone(_HandPalm)
export const Prohibit = duotone(_Prohibit)
