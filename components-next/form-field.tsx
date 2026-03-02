'use client'

import * as React from 'react'
import { FloatingInput } from '@/components/ui/floating-input'

// --- Formatters ---

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

function formatCVV(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

function formatZIP(value: string): string {
  return value.replace(/\D/g, '').slice(0, 5)
}

// --- FormField ---

function FormField({
  label,
  value,
  onChange,
  validate,
  format,
  error: controlledError,
  isValid: controlledIsValid,
  className,
  labelClassName,
  ...props
}: Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  label: string
  value: string
  onChange: (value: string) => void
  validate?: (value: string) => string | undefined
  format?: (value: string) => string
  error?: string
  isValid?: boolean
  labelClassName?: string
}) {
  const [touched, setTouched] = React.useState(false)

  const validationError = validate?.(value)
  const showError = touched && !controlledIsValid
  const error = controlledError ?? (showError ? validationError : undefined)
  const isValid = controlledIsValid ?? (touched && !validationError && value.length > 0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    onChange(format ? format(raw) : raw)
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(true)
    props.onBlur?.(e)
  }

  return (
    <FloatingInput
      data-slot="form-field"
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      isValid={isValid}
      className={className}
      labelClassName={labelClassName}
      {...props}
    />
  )
}

export { FormField, formatCardNumber, formatExpiry, formatCVV, formatZIP }
