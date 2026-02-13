"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClabeFlowPanelProps {
  onSubmit: (accountNumber: string) => void
  onClose: () => void
  recipientName?: string
}

export function ClabeFlowPanel({ onSubmit, onClose, recipientName }: ClabeFlowPanelProps) {
  const [clabeNumber, setClabeNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanClabe = clabeNumber.replace(/\s/g, "")
    const cleanCard = cardNumber.replace(/\s/g, "")

    // Check if at least one field is filled
    if (!cleanClabe && !cleanCard) {
      setError("Please enter either a CLABE or Card number")
      return
    }

    // Check if both fields are filled
    if (cleanClabe && cleanCard) {
      setError("Please enter only one: either CLABE or Card number")
      return
    }

    // Validate CLABE if provided
    if (cleanClabe) {
      if (cleanClabe.length !== 18) {
        setError("CLABE must be exactly 18 digits")
        return
      }
      if (!/^\d+$/.test(cleanClabe)) {
        setError("CLABE must contain only numbers")
        return
      }
      onSubmit(cleanClabe)
      return
    }

    // Validate Card if provided
    if (cleanCard) {
      if (cleanCard.length !== 16) {
        setError("Card number must be exactly 16 digits")
        return
      }
      if (!/^\d+$/.test(cleanCard)) {
        setError("Card number must contain only numbers")
        return
      }
      onSubmit(cleanCard)
      return
    }
  }

  const handleClabeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setClabeNumber(value)
    setError("")
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCardNumber(value)
    setError("")
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl shadow-xl animate-slide-up max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Enter Account Details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="clabeNumber">{recipientName ? `${recipientName}'s ` : ""}CLABE Number (18 digits)</Label>
            <Input
              id="clabeNumber"
              value={clabeNumber}
              onChange={handleClabeChange}
              placeholder="002910701234567890"
              maxLength={18}
              className={error ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground">ex: 002910701234567890</p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-muted-foreground/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="cardNumber">
              {recipientName ? `${recipientName}'s ` : ""}Credit or Debit Card (16 digits)
            </Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardChange}
              placeholder="1234567890123456"
              maxLength={16}
              className={error ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground">ex: 1234567890123456</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full mt-8">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
