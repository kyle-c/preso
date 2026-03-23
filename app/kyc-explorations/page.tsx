'use client'

import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/*  Shared icon components (inline SVGs)                              */
/* ------------------------------------------------------------------ */

function ShieldIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function InfoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function ChevronRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function ChevronDown({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ArrowUpIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  )
}

function LightningIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function WaveIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11.5V7a2 2 0 0 1 4 0v4.5" />
      <path d="M11 9.5V6a2 2 0 0 1 4 0v5.5" />
      <path d="M15 9.5V7.5a2 2 0 0 1 4 0v6.5a8 8 0 0 1-8 8h-1a8 8 0 0 1-5.66-2.34" />
      <path d="M7 11.5a2 2 0 0 0-4 0v2a8 8 0 0 0 1.34 4.44" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared form mockup                                                */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  required = false,
  placeholder,
}: {
  label: string
  required?: boolean
  placeholder: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#082422]">
        {label}
        {required && <span className="text-[#F26629] ml-0.5">*</span>}
      </label>
      <div className="h-10 rounded-lg border border-[#CFCABF] bg-white px-3 flex items-center">
        <span className="text-xs text-[#877867]">{placeholder}</span>
      </div>
    </div>
  )
}

function DateFields() {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#082422]">
        Fecha de nacimiento<span className="text-[#F26629] ml-0.5">*</span>
      </label>
      <div className="flex gap-2">
        {['Mes', 'Día', 'Año'].map((p) => (
          <div
            key={p}
            className="flex-1 h-10 rounded-lg border border-[#CFCABF] bg-white px-3 flex items-center justify-between"
          >
            <span className="text-xs text-[#877867]">{p}</span>
            <ChevronDown className="w-3 h-3 text-[#877867]" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SharedHeader() {
  return (
    <>
      {/* Status bar (simplified) */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[10px] font-semibold text-[#082422]">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 rounded-sm bg-[#082422]" />
          <div className="w-3 h-2 rounded-sm bg-[#082422]" />
          <div className="w-6 h-3 rounded-sm border border-[#082422] relative">
            <div className="absolute inset-0.5 right-1 rounded-xs bg-[#082422]" />
          </div>
        </div>
      </div>

      {/* Felix logo + agent badge */}
      <div className="px-5 pt-2 pb-1 flex items-center justify-between">
        <span className="font-display font-black text-lg text-[#082422] tracking-tight">
          Félix
        </span>
        <span className="text-[8px] text-[#877867] bg-[#EFEBE7] rounded-full px-2 py-0.5 font-medium">
          An authorized agent of intermex
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-1 pb-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] text-[#877867] font-medium">Paso 1 de 3</span>
        </div>
        <div className="h-1.5 w-full bg-[#EFEBE7] rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#2BF2F1] rounded-full" />
        </div>
      </div>
    </>
  )
}

function SharedFormFields() {
  return (
    <>
      <FormField label="Nombre" required placeholder="ej. María" />
      <FormField label="Segundo nombre" required={false} placeholder="ej. José" />
      <FormField label="Apellido Paterno" required placeholder="ej. García" />
    </>
  )
}

function SharedFormBottom() {
  return (
    <>
      <DateFields />
      <p className="text-[9px] text-[#877867] leading-tight">
        Por favor completa con tu información personal tal y como aparece en tu ID.
      </p>
      <FormField label="Correo electrónico" required placeholder="ej. mariajose@gmail.com" />
      <p className="text-[9px] text-[#877867] leading-tight">
        Aquí es donde recibirás los recibos de tus remesas.
      </p>
      <Button className="w-full mt-1 h-11 rounded-full bg-[#2BF2F1] text-[#082422] font-semibold text-sm hover:bg-[#2BF2F1]/80">
        Continuar
      </Button>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Phone Frame wrapper                                               */
/* ------------------------------------------------------------------ */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 390, height: 844 }}>
      {/* Outer shell */}
      <div
        className="absolute inset-0 rounded-[52px] bg-[#1a1a1a] shadow-2xl"
        style={{ padding: 4 }}
      >
        {/* Screen */}
        <div className="w-full h-full rounded-[48px] bg-white overflow-hidden overflow-y-auto">
          {/* Notch */}
          <div className="flex justify-center pt-2">
            <div className="w-28 h-6 bg-[#1a1a1a] rounded-full" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT A — Warm Nudge                                            */
/* ------------------------------------------------------------------ */

function VariantA() {
  return (
    <PhoneFrame>
      <SharedHeader />

      {/* Title */}
      <div className="px-5 pb-3">
        <h2 className="font-display font-black text-xl text-[#082422] leading-tight">
          Cuéntanos más sobre ti
        </h2>
      </div>

      {/* Banner: soft rounded card in cactus/sage */}
      <div className="px-5 pb-3">
        <div className="rounded-2xl bg-[#60D06F]/10 border border-[#7BA882]/30 p-3 flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">
            <ShieldIcon className="w-5 h-5 text-[#7BA882]" />
          </div>
          <div className="flex-1 flex items-start justify-between gap-2">
            <p className="text-[11px] text-[#35605F] leading-snug font-medium">
              Verificar tu identidad es rápido y seguro — y te da acceso a más beneficios
            </p>
            <ChevronRight className="w-4 h-4 text-[#7BA882] shrink-0 mt-0.5" />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="px-5 space-y-3">
        <SharedFormFields />

        {/* Apellido Materno + warm tip */}
        <FormField label="Apellido Materno" placeholder="ej. Martínez" />
        <div className="flex items-start gap-2 bg-[#7BA882]/8 rounded-lg p-2.5">
          <InfoIcon className="w-3.5 h-3.5 text-[#7BA882] shrink-0 mt-0.5" />
          <p className="text-[9px] text-[#35605F] leading-snug">
            <span className="font-semibold">Tip:</span> Agregar tu apellido materno nos ayuda a
            verificar tu identidad más rápido y evitar retrasos en tus envíos.
          </p>
        </div>

        <SharedFormBottom />
      </div>
      <div className="h-8" />
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT B — Trust Builder                                         */
/* ------------------------------------------------------------------ */

function VariantB() {
  return (
    <PhoneFrame>
      <SharedHeader />

      {/* Title */}
      <div className="px-5 pb-3">
        <h2 className="font-display font-black text-xl text-[#082422] leading-tight">
          Cuéntanos más sobre ti
        </h2>
      </div>

      {/* Banner: full-width evergreen strip */}
      <div className="mb-3">
        <div className="bg-[#35605F] px-5 py-3 flex items-center gap-2.5">
          <ShieldIcon className="w-5 h-5 text-white shrink-0" />
          <p className="text-[10px] text-white leading-snug font-medium">
            Tu información está protegida. Verificarte te da acceso a límites más altos y envíos
            más rápidos.
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="px-5 space-y-3">
        <SharedFormFields />

        {/* Apellido Materno + bordered callout */}
        <FormField label="Apellido Materno" placeholder="ej. Martínez" />
        <div className="rounded-lg border border-[#CFCABF] border-l-[3px] border-l-[#2BF2F1] p-2.5 flex items-start gap-2">
          <InfoIcon className="w-3.5 h-3.5 text-[#35605F] shrink-0 mt-0.5" />
          <p className="text-[9px] text-[#35605F] leading-snug">
            ¿Tienes dos apellidos? Inclúyelos ambos — así coinciden con tu identificación y todo
            fluye sin problemas.
          </p>
        </div>

        <SharedFormBottom />
      </div>
      <div className="h-8" />
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT C — Benefit Cards                                         */
/* ------------------------------------------------------------------ */

function VariantC() {
  return (
    <PhoneFrame>
      <SharedHeader />

      {/* Title */}
      <div className="px-5 pb-3">
        <h2 className="font-display font-black text-xl text-[#082422] leading-tight">
          Cuéntanos más sobre ti
        </h2>
      </div>

      {/* Banner: benefit chips */}
      <div className="px-5 pb-3">
        <p className="text-[10px] font-semibold text-[#082422] mb-2">
          Verifica tu identidad para desbloquear:
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-[#EFEBE7] rounded-full px-2.5 py-1.5">
            <ArrowUpIcon className="w-3 h-3 text-[#35605F]" />
            <span className="text-[9px] font-medium text-[#35605F]">Sin límites</span>
          </div>
          <div className="flex items-center gap-1 bg-[#EFEBE7] rounded-full px-2.5 py-1.5">
            <LightningIcon className="w-3 h-3 text-[#35605F]" />
            <span className="text-[9px] font-medium text-[#35605F]">Envíos rápidos</span>
          </div>
          <div className="flex items-center gap-1 bg-[#EFEBE7] rounded-full px-2.5 py-1.5">
            <ShieldIcon className="w-3 h-3 text-[#35605F]" />
            <span className="text-[9px] font-medium text-[#35605F]">100% seguro</span>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="px-5 space-y-3">
        <SharedFormFields />

        {/* Apellido Materno + accordion */}
        <FormField label="Apellido Materno" placeholder="ej. Martínez" />
        <div className="rounded-lg border border-[#CFCABF] overflow-hidden">
          <div className="flex items-center justify-between p-2.5">
            <span className="text-[10px] font-medium text-[#082422]">
              ¿Por qué pedimos apellido materno?
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#877867]" />
          </div>
          <div className="px-2.5 pb-2.5 border-t border-[#EFEBE7] pt-2">
            <p className="text-[9px] text-[#877867] leading-snug">
              En muchos países de Latinoamérica se usan dos apellidos. Agregar ambos nos ayuda a
              verificar tu identidad correctamente.
            </p>
          </div>
        </div>

        <SharedFormBottom />
      </div>
      <div className="h-8" />
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/*  VARIANT D — Conversational                                        */
/* ------------------------------------------------------------------ */

function VariantD() {
  return (
    <PhoneFrame>
      <SharedHeader />

      {/* Title */}
      <div className="px-5 pb-3">
        <h2 className="font-display font-black text-xl text-[#082422] leading-tight">
          Cuéntanos más sobre ti
        </h2>
      </div>

      {/* Banner: speech bubble + Felix mascot */}
      <div className="px-5 pb-3">
        <div className="flex items-start gap-2">
          {/* Felix mascot */}
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#EFEBE7] overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/Félix Illo 1.svg"
              alt="Felix mascot"
              className="w-8 h-8 object-contain"
            />
          </div>
          {/* Speech bubble */}
          <div className="relative">
            <div className="rounded-2xl rounded-bl-sm bg-[#FFCD9C] p-3">
              <p className="text-[11px] text-[#082422] leading-snug font-medium">
                ¡Hola! Verifica tu identidad y desbloquea envíos sin límites. Es rápido y 100%
                seguro.
              </p>
            </div>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-1 left-3 w-3 h-3 bg-[#FFCD9C]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="px-5 space-y-3">
        <SharedFormFields />

        {/* Apellido Materno + friendly aside */}
        <FormField label="Apellido Materno" placeholder="ej. Martínez" />
        <div className="flex items-start gap-1.5 px-1">
          <WaveIcon className="w-3.5 h-3.5 text-[#877867] shrink-0 mt-0.5" />
          <p className="text-[9px] text-[#877867] leading-snug italic">
            Si tienes apellido materno, ¡agrégalo! Nos ayuda a que todo coincida con tu ID y tus
            envíos lleguen sin contratiempos.
          </p>
        </div>

        <SharedFormBottom />
      </div>
      <div className="h-8" />
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
      <p className="font-display font-black text-base text-[#082422]">
        {letter} &middot; {name}
      </p>
      <p className="text-sm text-[#877867] mt-0.5">{description}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function KycExplorationsPage() {
  return (
    <div className="min-h-screen bg-[#EFEBE7]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#082422] tracking-tight">
          KYC Form Explorations
        </h1>
        <p className="text-base text-[#877867] mt-2 max-w-2xl mx-auto">
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
