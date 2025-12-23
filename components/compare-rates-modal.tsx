"use client"

import { Button } from "@/components/ui/button"

interface CompareRatesModalProps {
  isOpen: boolean
  onClose: () => void
}

const XIcon = () => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export function CompareRatesModal({ isOpen, onClose }: CompareRatesModalProps) {
  if (!isOpen) return null

  const providers = [
    { name: "Félix", rate: 18.65, fee: 0, total: 18.65, highlight: true },
    { name: "Wise", rate: 18.42, fee: 4.99, total: 18.37 },
    { name: "Remitly", rate: 18.35, fee: 3.99, total: 18.31 },
    { name: "Western Union", rate: 18.15, fee: 5.99, total: 18.09 },
    { name: "MoneyGram", rate: 18.05, fee: 4.99, total: 18.0 },
    { name: "Xoom", rate: 17.95, fee: 4.99, total: 17.9 },
  ]

  return (
    <div className="absolute inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-background rounded-t-3xl shadow-2xl h-[700px] overflow-hidden w-full animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-foreground">Compare Exchange Rates</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <XIcon />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className={`rounded-xl p-4 border-2 transition-all ${
                  provider.highlight
                    ? "bg-[#D4F4DD] border-[#25D366] shadow-lg"
                    : "bg-card border-border hover:border-muted-foreground"
                }`}
                >
                  {provider.highlight ? (
                    <>
                      {/* Header with brand and badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground">Félix 💚</h3>
                          <span className="bg-[#25D366] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            Best Rate
                          </span>
                          <span className="bg-[#128C7E] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            Free Transfer
                          </span>
                        </div>
                      </div>

                      {/* Exchange Rate Section */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Exchange Rate</p>
                        <p className="text-lg font-bold text-foreground">18.65 MXN per USD</p>
                        <p className="text-xs text-[#128C7E] font-medium mt-1">↑ +0.12 MXN vs yesterday</p>
                      </div>


                      {/* Total Amount - Most Prominent */}
                      <div className="bg-white/60 rounded-lg p-3 mb-3">
                        <p className="text-2xl font-bold text-foreground">💵 You'll get 1,865 MXN</p>
                        <p className="text-sm font-medium text-[#128C7E] mt-1">🏅 +100 MXN for every friend you refer</p>
                      </div>

                      {/* Footer Info */}
                      <p className="text-xs text-muted-foreground">Rate updated 2 min ago • Based on Banxico</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">${provider.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">per USD</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-muted-foreground">Exchange Rate</p>
                          <p className="font-medium text-foreground">{provider.rate} MXN</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Transfer Fee</p>
                          <p className="font-medium text-foreground">
                            {provider.fee === 0 ? "FREE" : `$${provider.fee.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
