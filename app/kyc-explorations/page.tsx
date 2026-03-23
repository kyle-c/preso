'use client'

import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { Signal, Wifi, Battery, Shield, Info, ChevronRight, ChevronDown, Zap, ArrowUp } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Phone Frame (matches fintechtestflow)                             */
/* ------------------------------------------------------------------ */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute top-[54px] left-0 right-0 z-30 h-[3px] bg-slate/10">
        <div className="h-full w-1/3 bg-turquoise" />
      </div>
      {/* Content */}
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen Header (Felix logo + badge)                                */
/* ------------------------------------------------------------------ */

function ScreenHeader() {
  return (
    <div className="flex flex-col items-center pt-5 pb-4">
      <FelixLogo className="h-8 text-slate" />
      <div className="mt-3.5 rounded-full bg-turquoise px-2.5 py-0.5">
        <span className="text-[10px] font-semibold text-slate">An authorized agent of intermex</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Form primitives                                                   */
/* ------------------------------------------------------------------ */

type Lang = 'es' | 'en'

const t = {
  es: {
    badge: 'An authorized agent of intermex',
    title: 'Cuéntanos más sobre ti',
    nombre: 'Nombre', segundoNombre: 'Segundo nombre', apellidoPaterno: 'Apellido Paterno', apellidoMaterno: 'Apellido Materno',
    fechaNac: 'Fecha de nacimiento', mes: 'Mes', dia: 'Día', ano: 'Año',
    idHelper: 'Por favor completa con tu información personal tal y como aparece en tu ID.',
    correo: 'Correo electrónico', correoHelper: 'Aquí es donde recibirás los recibos de tus remesas.',
    continuar: 'Continuar',
    bannerA: 'Verificar tu identidad es rápido y seguro — y te da acceso a más beneficios',
    tipA: 'Agregar tu apellido materno nos ayuda a verificar tu identidad más rápido y evitar retrasos en tus envíos.',
    bannerB: 'Tu información está protegida. Verificarte te da acceso a límites más altos y envíos más rápidos.',
    hintB: '¿Tienes dos apellidos? Inclúyelos ambos — así coinciden con tu identificación y todo fluye sin problemas.',
    chipsSectionC: 'Verifica tu identidad para desbloquear:',
    chip1: 'Sin límites', chip2: 'Envíos rápidos', chip3: '100% seguro',
    accordionQ: '¿Por qué pedimos apellido materno?',
    accordionA: 'En muchos países de Latinoamérica se usan dos apellidos. Agregar ambos nos ayuda a verificar tu identidad correctamente.',
    bannerD: '¡Hola! Verifica tu identidad y desbloquea envíos sin límites. Es rápido y 100% seguro.',
    hintD: 'Si tienes apellido materno, agrégalo. Nos ayuda a que todo coincida con tu ID y tus envíos lleguen sin contratiempos.',
  },
  en: {
    badge: 'An authorized agent of intermex',
    title: 'Tell us about yourself',
    nombre: 'First name', segundoNombre: 'Middle name', apellidoPaterno: 'Last name', apellidoMaterno: 'Second last name',
    fechaNac: 'Date of birth', mes: 'Month', dia: 'Day', ano: 'Year',
    idHelper: 'Please enter your personal information exactly as it appears on your ID.',
    correo: 'Email address', correoHelper: 'This is where you\'ll receive your transfer receipts.',
    continuar: 'Continue',
    bannerA: 'Verifying your identity is quick and secure — and gives you access to more benefits',
    tipA: 'Adding your second last name helps us verify your identity faster and avoid delays in your transfers.',
    bannerB: 'Your information is protected. Verifying gives you access to higher limits and faster transfers.',
    hintB: 'Have two last names? Include both — that way they match your ID and everything goes smoothly.',
    chipsSectionC: 'Verify your identity to unlock:',
    chip1: 'No limits', chip2: 'Fast transfers', chip3: '100% secure',
    accordionQ: 'Why do we ask for a second last name?',
    accordionA: 'In many Latin American countries, two last names are used. Adding both helps us verify your identity correctly.',
    bannerD: 'Hi! Verify your identity and unlock unlimited transfers. It\'s quick and 100% secure.',
    hintD: 'If you have a second last name, add it! It helps everything match your ID so your transfers arrive without issues.',
  },
}

function FormInput({
  label,
  required = false,
  placeholder,
}: {
  label: string
  required?: boolean
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[14px] font-semibold text-slate">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="h-14 rounded-2xl border border-slate/20 bg-white px-4 flex items-center">
        <span className="text-[15px] text-slate/30">{placeholder}</span>
      </div>
    </div>
  )
}

function DateFields({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <div className="space-y-1.5">
      <label className="text-[14px] font-semibold text-slate">
        {s.fechaNac}<span className="text-destructive ml-0.5">*</span>
      </label>
      <div className="flex gap-2">
        {[s.mes, s.dia, s.ano].map((p) => (
          <div
            key={p}
            className="flex-1 h-14 rounded-2xl border border-slate/20 bg-white px-4 flex items-center justify-between"
          >
            <span className="text-[15px] text-slate/30">{p}</span>
            <ChevronDown className="w-4 h-4 text-mocha" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SharedFormFields({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <>
      <FormInput label={s.nombre} required placeholder="ej. María" />
      <FormInput label={s.segundoNombre} placeholder="ej. José" />
      <FormInput label={s.apellidoPaterno} required placeholder="ej. García" />
    </>
  )
}

function SharedFormBottom({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <>
      <DateFields lang={lang} />
      <p className="text-[12px] text-mocha leading-snug">{s.idHelper}</p>
      <FormInput label={s.correo} required placeholder="ej. mariajose@gmail.com" />
      <p className="text-[12px] text-mocha leading-snug">{s.correoHelper}</p>
      <div className="pt-4">
        <Button size="lg" className="w-full text-[15px]">{s.continuar}</Button>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT A — Warm Nudge                                            */
/* ------------------------------------------------------------------ */

function VariantA({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <PhoneFrame>
      <ScreenHeader />
      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">{s.title}</h1>
        <div className="rounded-2xl bg-cactus/10 border border-cactus/30 p-4 flex items-start gap-3 mb-6">
          <Shield className="w-5 h-5 text-cactus shrink-0 mt-0.5" />
          <div className="flex-1 flex items-start justify-between gap-2">
            <p className="text-[13px] text-evergreen leading-snug font-medium">{s.bannerA}</p>
            <ChevronRight className="w-4 h-4 text-cactus shrink-0 mt-0.5" />
          </div>
        </div>
        <div className="space-y-4">
          <SharedFormFields lang={lang} />
          <FormInput label={s.apellidoMaterno} placeholder="ej. Martínez" />
          <div className="flex items-start gap-2.5 rounded-2xl bg-cactus/8 p-3.5">
            <Info className="w-4 h-4 text-cactus shrink-0 mt-0.5" />
            <p className="text-[12px] text-evergreen leading-snug"><span className="font-semibold">Tip:</span> {s.tipA}</p>
          </div>
          <SharedFormBottom lang={lang} />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT B — Trust Builder                                         */
/* ------------------------------------------------------------------ */

function VariantB({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <PhoneFrame>
      <ScreenHeader />
      <div className="px-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">{s.title}</h1>
      </div>
      <div className="bg-evergreen px-6 py-4 flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-white shrink-0" />
        <p className="text-[13px] text-white leading-snug font-medium">{s.bannerB}</p>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <SharedFormFields lang={lang} />
          <FormInput label={s.apellidoMaterno} placeholder="ej. Martínez" />
          <div className="rounded-2xl border border-slate/20 border-l-[3px] border-l-turquoise p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-evergreen shrink-0 mt-0.5" />
            <p className="text-[12px] text-evergreen leading-snug">{s.hintB}</p>
          </div>
          <SharedFormBottom lang={lang} />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT C — Benefit Cards                                         */
/* ------------------------------------------------------------------ */

function VariantC({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <PhoneFrame>
      <ScreenHeader />
      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">{s.title}</h1>
        <p className="text-[13px] font-semibold text-slate mb-3">{s.chipsSectionC}</p>
        <div className="flex gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <ArrowUp className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">{s.chip1}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <Zap className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">{s.chip2}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">{s.chip3}</span>
          </div>
        </div>
        <div className="space-y-4">
          <SharedFormFields lang={lang} />
          <FormInput label={s.apellidoMaterno} placeholder="ej. Martínez" />
          <div className="rounded-2xl border border-slate/20 overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <span className="text-[13px] font-semibold text-slate">{s.accordionQ}</span>
              <ChevronDown className="w-4 h-4 text-mocha" />
            </div>
            <div className="px-3.5 pb-3.5 border-t border-stone pt-3">
              <p className="text-[12px] text-mocha leading-snug">{s.accordionA}</p>
            </div>
          </div>
          <SharedFormBottom lang={lang} />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT D — Conversational                                        */
/* ------------------------------------------------------------------ */

function VariantD({ lang = 'es' }: { lang?: Lang }) {
  const s = t[lang]
  return (
    <PhoneFrame>
      <ScreenHeader />
      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">{s.title}</h1>
        <div className="flex items-start gap-3 mb-6">
          <div className="w-11 h-11 shrink-0 rounded-full bg-stone overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/Félix Illo 1.svg" alt="Felix mascot" className="w-9 h-9 object-contain" />
          </div>
          <div className="relative">
            <div className="rounded-2xl rounded-bl-sm bg-lychee p-4">
              <p className="text-[13px] text-slate leading-snug font-medium">{s.bannerD}</p>
            </div>
            <div className="absolute -bottom-1 left-3 w-3 h-3 bg-lychee" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          </div>
        </div>
        <div className="space-y-4">
          <SharedFormFields lang={lang} />
          <FormInput label={s.apellidoMaterno} placeholder="ej. Martínez" />
          <div className="flex items-start gap-2 px-1">
            <Info className="w-4 h-4 text-mocha shrink-0 mt-0.5" />
            <p className="text-[12px] text-mocha leading-snug italic">{s.hintD}</p>
          </div>
          <SharedFormBottom lang={lang} />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  Variant label                                                     */
/* ------------------------------------------------------------------ */

function VariantLabel({
  letter,
  name,
  description,
}: {
  letter: string
  name: string
  description: string
}) {
  return (
    <div className="text-center mt-5">
      <p className="font-display font-extrabold text-base text-slate">
        {letter} &middot; {name}
      </p>
      <p className="text-sm text-mocha mt-0.5">{description}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function KycExplorationsPage() {
  return (
    <div className="min-h-screen bg-stone">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate tracking-tight">
          KYC Form Explorations
        </h1>
        <p className="text-base text-mocha mt-2 max-w-2xl mx-auto">
          Four design variants exploring different approaches to the verification banner and
          the apellido materno hint in the Felix Pago KYC flow.
        </p>
      </div>

      {/* Variants — each row shows ES + EN side by side */}
      <div className="max-w-[1680px] mx-auto px-6 pb-16 space-y-16">
        {([
          { letter: 'A', name: 'Warm Nudge', desc: 'Soft card with cactus/sage tones and an inline tip below the field', Component: VariantA },
          { letter: 'B', name: 'Trust Builder', desc: 'Full-width evergreen strip with a turquoise-bordered callout', Component: VariantB },
          { letter: 'C', name: 'Benefit Cards', desc: 'Compact benefit chips with an expandable accordion for the hint', Component: VariantC },
          { letter: 'D', name: 'Conversational', desc: 'Speech-bubble style with Felix mascot and a casual italic aside', Component: VariantD },
        ] as const).map(({ letter, name, desc, Component }) => (
          <div key={letter}>
            <div className="text-center mb-6">
              <p className="font-display font-extrabold text-xl text-slate">{letter} &middot; {name}</p>
              <p className="text-sm text-mocha mt-0.5">{desc}</p>
            </div>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-mocha uppercase tracking-widest mb-3">Español</span>
                <div className="transform scale-[0.48] origin-top" style={{ height: 420 }}>
                  <Component lang="es" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-mocha uppercase tracking-widest mb-3">English</span>
                <div className="transform scale-[0.48] origin-top" style={{ height: 420 }}>
                  <Component lang="en" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
