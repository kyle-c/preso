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

function DateFields() {
  return (
    <div className="space-y-1.5">
      <label className="text-[14px] font-semibold text-slate">
        Fecha de nacimiento<span className="text-destructive ml-0.5">*</span>
      </label>
      <div className="flex gap-2">
        {['Mes', 'Día', 'Año'].map((p) => (
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

function SharedFormFields() {
  return (
    <>
      <FormInput label="Nombre" required placeholder="ej. María" />
      <FormInput label="Segundo nombre" placeholder="ej. José" />
      <FormInput label="Apellido Paterno" required placeholder="ej. García" />
    </>
  )
}

function SharedFormBottom() {
  return (
    <>
      <DateFields />
      <p className="text-[12px] text-mocha leading-snug">
        Por favor completa con tu información personal tal y como aparece en tu ID.
      </p>
      <FormInput label="Correo electrónico" required placeholder="ej. mariajose@gmail.com" />
      <p className="text-[12px] text-mocha leading-snug">
        Aquí es donde recibirás los recibos de tus remesas.
      </p>
      <div className="pt-4">
        <Button size="lg" className="w-full text-[15px]">
          Continuar
        </Button>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT A — Warm Nudge                                            */
/* ------------------------------------------------------------------ */

function VariantA() {
  return (
    <PhoneFrame>
      <ScreenHeader />

      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          Cuéntanos más sobre ti
        </h1>

        {/* Banner: soft cactus card */}
        <div className="rounded-2xl bg-cactus/10 border border-cactus/30 p-4 flex items-start gap-3 mb-6">
          <Shield className="w-5 h-5 text-cactus shrink-0 mt-0.5" />
          <div className="flex-1 flex items-start justify-between gap-2">
            <p className="text-[13px] text-evergreen leading-snug font-medium">
              Verificar tu identidad es rápido y seguro — y te da acceso a más beneficios
            </p>
            <ChevronRight className="w-4 h-4 text-cactus shrink-0 mt-0.5" />
          </div>
        </div>

        <div className="space-y-4">
          <SharedFormFields />

          {/* Apellido Materno + sage tip */}
          <FormInput label="Apellido Materno" placeholder="ej. Martínez" />
          <div className="flex items-start gap-2.5 rounded-2xl bg-cactus/8 p-3.5">
            <Info className="w-4 h-4 text-cactus shrink-0 mt-0.5" />
            <p className="text-[12px] text-evergreen leading-snug">
              <span className="font-semibold">Tip:</span> Agregar tu apellido materno nos ayuda a
              verificar tu identidad más rápido y evitar retrasos en tus envíos.
            </p>
          </div>

          <SharedFormBottom />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT B — Trust Builder                                         */
/* ------------------------------------------------------------------ */

function VariantB() {
  return (
    <PhoneFrame>
      <ScreenHeader />

      <div className="px-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          Cuéntanos más sobre ti
        </h1>
      </div>

      {/* Banner: full-width evergreen strip */}
      <div className="bg-evergreen px-6 py-4 flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-white shrink-0" />
        <p className="text-[13px] text-white leading-snug font-medium">
          Tu información está protegida. Verificarte te da acceso a límites más altos y envíos
          más rápidos.
        </p>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-4">
          <SharedFormFields />

          {/* Apellido Materno + turquoise-bordered callout */}
          <FormInput label="Apellido Materno" placeholder="ej. Martínez" />
          <div className="rounded-2xl border border-slate/20 border-l-[3px] border-l-turquoise p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-evergreen shrink-0 mt-0.5" />
            <p className="text-[12px] text-evergreen leading-snug">
              ¿Tienes dos apellidos? Inclúyelos ambos — así coinciden con tu identificación y todo
              fluye sin problemas.
            </p>
          </div>

          <SharedFormBottom />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT C — Benefit Cards                                         */
/* ------------------------------------------------------------------ */

function VariantC() {
  return (
    <PhoneFrame>
      <ScreenHeader />

      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          Cuéntanos más sobre ti
        </h1>

        {/* Banner: benefit chips */}
        <p className="text-[13px] font-semibold text-slate mb-3">
          Verifica tu identidad para desbloquear:
        </p>
        <div className="flex gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <ArrowUp className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">Sin límites</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <Zap className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">Envíos rápidos</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone rounded-full px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-evergreen" />
            <span className="text-[11px] font-semibold text-evergreen">100% seguro</span>
          </div>
        </div>

        <div className="space-y-4">
          <SharedFormFields />

          {/* Apellido Materno + accordion hint */}
          <FormInput label="Apellido Materno" placeholder="ej. Martínez" />
          <div className="rounded-2xl border border-slate/20 overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <span className="text-[13px] font-semibold text-slate">
                ¿Por qué pedimos apellido materno?
              </span>
              <ChevronDown className="w-4 h-4 text-mocha" />
            </div>
            <div className="px-3.5 pb-3.5 border-t border-stone pt-3">
              <p className="text-[12px] text-mocha leading-snug">
                En muchos países de Latinoamérica se usan dos apellidos. Agregar ambos nos ayuda a
                verificar tu identidad correctamente.
              </p>
            </div>
          </div>

          <SharedFormBottom />
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT D — Conversational                                        */
/* ------------------------------------------------------------------ */

function VariantD() {
  return (
    <PhoneFrame>
      <ScreenHeader />

      <div className="px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          Cuéntanos más sobre ti
        </h1>

        {/* Banner: speech bubble + Felix mascot */}
        <div className="flex items-start gap-3 mb-6">
          {/* Felix mascot */}
          <div className="w-11 h-11 shrink-0 rounded-full bg-stone overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/Félix Illo 1.svg"
              alt="Felix mascot"
              className="w-9 h-9 object-contain"
            />
          </div>
          {/* Speech bubble */}
          <div className="relative">
            <div className="rounded-2xl rounded-bl-sm bg-lychee p-4">
              <p className="text-[13px] text-slate leading-snug font-medium">
                ¡Hola! Verifica tu identidad y desbloquea envíos sin límites. Es rápido y 100%
                seguro.
              </p>
            </div>
            <div
              className="absolute -bottom-1 left-3 w-3 h-3 bg-lychee"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <SharedFormFields />

          {/* Apellido Materno + casual italic aside */}
          <FormInput label="Apellido Materno" placeholder="ej. Martínez" />
          <div className="flex items-start gap-2 px-1">
            <Info className="w-4 h-4 text-mocha shrink-0 mt-0.5" />
            <p className="text-[12px] text-mocha leading-snug italic">
              Si tienes apellido materno, agrégalo. Nos ayuda a que todo coincida con tu ID y tus
              envíos lleguen sin contratiempos.
            </p>
          </div>

          <SharedFormBottom />
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

      {/* Grid of phone mockups */}
      <div className="max-w-[1680px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
          {/* Variant A */}
          <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>
            <div className="transform scale-[0.48] md:scale-[0.52] origin-top">
              <VariantA />
            </div>
            <div className="-mt-[380px] md:-mt-[360px]">
              <VariantLabel
                letter="A"
                name="Warm Nudge"
                description="Soft card with cactus/sage tones and an inline tip below the field"
              />
            </div>
          </div>

          {/* Variant B */}
          <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>
            <div className="transform scale-[0.48] md:scale-[0.52] origin-top">
              <VariantB />
            </div>
            <div className="-mt-[380px] md:-mt-[360px]">
              <VariantLabel
                letter="B"
                name="Trust Builder"
                description="Full-width evergreen strip with a turquoise-bordered callout"
              />
            </div>
          </div>

          {/* Variant C */}
          <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>
            <div className="transform scale-[0.48] md:scale-[0.52] origin-top">
              <VariantC />
            </div>
            <div className="-mt-[380px] md:-mt-[360px]">
              <VariantLabel
                letter="C"
                name="Benefit Cards"
                description="Compact benefit chips with an expandable accordion for the hint"
              />
            </div>
          </div>

          {/* Variant D */}
          <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>
            <div className="transform scale-[0.48] md:scale-[0.52] origin-top">
              <VariantD />
            </div>
            <div className="-mt-[380px] md:-mt-[360px]">
              <VariantLabel
                letter="D"
                name="Conversational"
                description="Speech-bubble style with Felix mascot and a casual italic aside"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
