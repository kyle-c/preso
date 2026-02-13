"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecipientFlowPanelProps {
  onSubmit: (data: { firstName: string; lastName: string; city: string; state: string; country: string }) => void
  onClose: () => void
}

export function RecipientFlowPanel({ onSubmit, onClose }: RecipientFlowPanelProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("Mexico")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (firstName && lastName && city && state && country) {
      onSubmit({ firstName, lastName, city, state, country })
    }
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl shadow-xl animate-slide-up max-w-full flex flex-col" style={{ maxHeight: '480px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Enter Recipient Details</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Guadalajara"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="JAL" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mexico">Mexico</SelectItem>
                <SelectItem value="Peru">Peru</SelectItem>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Ecuador">Ecuador</SelectItem>
                <SelectItem value="Costa Rica">Costa Rica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
