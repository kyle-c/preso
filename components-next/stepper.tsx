'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

// --- Context ---

interface StepperContextValue {
  activeStep: number
  totalSteps: number
  goTo: (step: number) => void
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepper() {
  const ctx = React.useContext(StepperContext)
  if (!ctx) {
    throw new Error('useStepper must be used within a <Stepper>')
  }
  return ctx
}

// --- Stepper (root) ---

function Stepper({
  children,
  step,
  onStepChange,
  defaultStep = 0,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  step?: number
  onStepChange?: (step: number) => void
  defaultStep?: number
}) {
  const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultStep)
  const isControlled = step !== undefined
  const activeStep = isControlled ? step : uncontrolledStep

  const totalSteps = React.useMemo(() => {
    let count = 0
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === StepperContent) {
        count++
      }
    })
    return count
  }, [children])

  const setStep = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, totalSteps - 1))
      if (!isControlled) setUncontrolledStep(clamped)
      onStepChange?.(clamped)
    },
    [isControlled, totalSteps, onStepChange],
  )

  const ctx = React.useMemo<StepperContextValue>(
    () => ({
      activeStep,
      totalSteps,
      goTo: setStep,
      next: () => setStep(activeStep + 1),
      prev: () => setStep(activeStep - 1),
      isFirst: activeStep === 0,
      isLast: activeStep === totalSteps - 1,
    }),
    [activeStep, totalSteps, setStep],
  )

  return (
    <StepperContext.Provider value={ctx}>
      <div data-slot="stepper" className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

// --- StepperProgress ---

function StepperProgress({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { activeStep, totalSteps } = useStepper()
  const pct = totalSteps > 1 ? ((activeStep + 1) / totalSteps) * 100 : 100

  return (
    <div
      data-slot="stepper-progress"
      className={cn('h-[3px] w-full overflow-hidden rounded-full bg-stone', className)}
      {...props}
    >
      <div
        data-slot="stepper-progress-fill"
        className="h-full bg-turquoise transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// --- StepperContent ---

function StepperContent({
  step,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { step: number }) {
  const { activeStep } = useStepper()

  if (activeStep !== step) return null

  return (
    <div data-slot="stepper-content" className={className} {...props}>
      {children}
    </div>
  )
}

// --- StepperPrev ---

function StepperPrev({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const { prev, isFirst } = useStepper()

  return (
    <button
      type="button"
      data-slot="stepper-prev"
      disabled={isFirst}
      onClick={prev}
      className={cn('disabled:pointer-events-none disabled:opacity-50', className)}
      {...props}
    >
      {children ?? 'Back'}
    </button>
  )
}

// --- StepperNext ---

function StepperNext({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const { next, isLast } = useStepper()

  return (
    <button
      type="button"
      data-slot="stepper-next"
      disabled={isLast}
      onClick={next}
      className={cn('disabled:pointer-events-none disabled:opacity-50', className)}
      {...props}
    >
      {children ?? 'Next'}
    </button>
  )
}

export {
  Stepper,
  StepperProgress,
  StepperContent,
  StepperPrev,
  StepperNext,
  useStepper,
}
