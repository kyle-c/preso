'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, Wifi, Battery, Signal } from 'lucide-react'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>

      {/* Screen Content */}
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

function DuplicateNumberScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 pb-4 pt-8">
      {/* Content */}
      <div className="flex-1">
        <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate">
          Parece que ya tienes un n&uacute;mero con F&eacute;lix
        </h1>

        <div className="mt-5 space-y-4">
          <p className="text-[15px] leading-relaxed text-slate/70">
            Para proteger tu cuenta, solo podemos tener un n&uacute;mero activo.
            <br />
            Tu n&uacute;mero actual es &nbsp;***1234.
          </p>

          <p className="text-[15px] font-medium text-slate">
            &iquest;Cu&aacute;l n&uacute;mero quieres mantener activo?
          </p>
        </div>
      </div>

      {/* Actions pinned to bottom */}
      <div className="space-y-2.5 pt-4">
        <Button size="lg" className="w-full text-[15px]" onClick={onNext}>
          Usar este n&uacute;mero
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">
          Usar otro n&uacute;mero
        </Button>
        <Button variant="link-muted" size="sm" className="w-full">
          Validate Later
        </Button>
      </div>
    </div>
  )
}

function AddressScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with logo */}
      <div className="flex flex-col items-center pt-4 pb-3">
        <FelixLogo className="h-7 text-slate" />
        <div className="mt-1.5 rounded-full bg-turquoise px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            An authorized agent of <span className="font-bold">UniTeller</span>
          </span>
        </div>
      </div>

      {/* Progress bar area */}
      <div className="flex items-center gap-3 px-6 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Progress value={50} className="h-1.5 flex-1 bg-slate/10 [&>[data-slot=progress-indicator]]:bg-slate" />
        <span className="text-[13px] text-slate/50">
          <span className="font-semibold text-slate">1</span> de 2
        </span>
      </div>

      {/* Form content */}
      <div className="flex-1 px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          Ingresa la direcci&oacute;n vinculada a tu tarjeta
        </h1>

        <div className="space-y-4">
          <FloatingInput label="Direcci&oacute;n *" className="!rounded-2xl bg-white [&+label]:bg-white" />
          <FloatingInput label="Apartamento/Suite/Piso" className="!rounded-2xl bg-white [&+label]:bg-white" />
          <FloatingInput label="C&oacute;digo Postal *" className="!rounded-2xl bg-white [&+label]:bg-white" />
          <FloatingInput label="Ciudad *" className="!rounded-2xl bg-white [&+label]:bg-white" />
          <Select>
            <SelectTrigger className="!h-14 w-full rounded-2xl bg-white px-4 text-base data-[placeholder]:text-muted-foreground">
              <SelectValue placeholder="Estado *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-8">
          <Button size="lg" className="w-full text-[15px]">
            Continuar
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MobileTestFlowPage() {
  const [screen, setScreen] = useState<'duplicate' | 'address'>('duplicate')

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone p-8">
      <PhoneFrame>
        {screen === 'duplicate' ? (
          <DuplicateNumberScreen onNext={() => setScreen('address')} />
        ) : (
          <AddressScreen onBack={() => setScreen('duplicate')} />
        )}
      </PhoneFrame>
    </div>
  )
}
