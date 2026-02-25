'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string
  error?: string
  isValid?: boolean
  labelClassName?: string
}

function FloatingInput({
  className,
  label,
  id,
  error,
  isValid,
  labelClassName,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const inputId = id || React.useId()

  const isFloating = isFocused || hasValue

  return (
    <div className="relative">
      <input
        id={inputId}
        data-slot="floating-input"
        className={cn(
          'peer h-14 w-full rounded-xl border bg-transparent px-4 pt-4 pb-2 text-base text-foreground transition-colors outline-none',
          'placeholder:text-transparent',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-[3px] focus:ring-red-400/20'
            : isValid
              ? 'border-turquoise/60 focus:border-turquoise focus:ring-[3px] focus:ring-turquoise/25'
              : 'border-border focus:border-turquoise focus:ring-[3px] focus:ring-turquoise/25',
          className,
        )}
        placeholder={label}
        onFocus={e => { setIsFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setIsFocused(false); setHasValue(e.target.value.length > 0); props.onBlur?.(e) }}
        onChange={e => { setHasValue(e.target.value.length > 0); props.onChange?.(e) }}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          'pointer-events-none absolute left-4 bg-linen px-1 transition-all duration-200',
          error ? 'text-red-400' : 'text-muted-foreground',
          isFloating
            ? cn('top-0 -translate-y-1/2 text-xs font-medium', error ? 'text-red-400' : 'text-foreground')
            : 'top-1/2 -translate-y-1/2 text-base',
          'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-foreground',
          'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-foreground',
          'peer-disabled:opacity-50',
          labelClassName,
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 px-1 text-[12px] text-red-400 leading-snug">{error}</p>
      )}
    </div>
  )
}

export { FloatingInput }
