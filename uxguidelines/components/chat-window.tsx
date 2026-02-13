"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Contact } from "./whatsapp-chat"

// Inline SVG icons
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
)

const MoreVerticalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const SmileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" x2="9.01" y1="9" y2="9" />
    <line x1="15" x2="15.01" y1="9" y2="9" />
  </svg>
)

const PaperclipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 0 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
)

const PlusIcon = () => (
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
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </svg>
)

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CheckCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 7 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
)

// Function to parse text with bold formatting (*text*)
const parseTextWithFormatting = (text: string) => {
  const parts: Array<{ text: string; bold: boolean }> = []
  const regex = /\*([^*]+)\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), bold: false })
    }
    // Add the bold part
    parts.push({ text: match[1], bold: true })
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false })
  }

  return parts.length > 0 ? parts : [{ text, bold: false }]
}

const VerifiedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#25D366]"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
)

interface Message {
  id: string
  text: string
  timestamp: string
  sent: boolean
  read?: boolean
  system?: boolean
  interactive?: {
    title: string
    subtitle: string
    quote?: string
    options: Array<{
      id: string
      label: string
      emoji: string
      selected?: boolean
    }>
  }
  recipientConfirmation?: {
    name: string
    location: string
  }
  confirmation?: {
    title: string
    fields: Array<{
      label: string
      value: string
    }>
    prompt: string
    actions: string[]
  }
  carousel?: {
    cards: Array<{
      image: string
      title: string
      description: string
    }>
  }
}

interface ChatWindowProps {
  contact: Contact
  messages: Message[]
  onSendMessage: (text: string) => void
  onOpenSidebar: () => void
  initialInputValue?: string
  isTyping?: boolean
  onMenuOptionClick?: (optionId: string) => void
  onTrackDetailsClick?: () => void
}

export function ChatWindow({
  contact,
  messages,
  onSendMessage,
  onOpenSidebar,
  initialInputValue = "",
  isTyping = false,
  onMenuOptionClick,
  onTrackDetailsClick,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState(initialInputValue)
  const [showInteractiveModal, setShowInteractiveModal] = useState(false)
  const [currentInteractiveMessage, setCurrentInteractiveMessage] = useState<Message | null>(null)
  const [showReferModal, setShowReferModal] = useState(false)
  const [referForm, setReferForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(initialInputValue)
  }, [initialInputValue])


  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 100)
      }
    }
  }, [messages, isTyping])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDeliveryMethodClick = (methodId: string) => {
    const methodMap: Record<string, string> = {
      cash: "CASH",
      bank: "BANK",
      card: "CARD",
      wallet: "WALLET",
    }
    const methodText = methodMap[methodId] || methodId.toUpperCase()
    onSendMessage(methodText)
  }

  const handleAmountClick = (amountId: string) => {
    // Send the amount in USD format
    onSendMessage(`${amountId} USD`)
  }

  const handleRecipientConfirmClick = (action: string) => {
    const actionMap: Record<string, string> = {
      "yes-correct": "yes-correct",
      "no-change": "no-change",
      yes: "YES",
      "update-name": "NAME",
      "update-location": "CITY",
    }
    const actionText = actionMap[action] || action
    onSendMessage(actionText)
  }

  const handleCLABEButtonClick = (optionId: string) => {
    const responseMap: Record<string, string> = {
      "clabe-yes": "Yes",
      "clabe-no": "No",
      "clabe-not-sure": "Not sure",
    }
    onSendMessage(responseMap[optionId])
  }

  const handleActionButtonClick = (optionId: string) => {
    // Map button IDs to user-friendly display text
    const buttonTextMap: Record<string, string> = {
      "confirm-location": "Confirm location",
      "enter-different": "Enter different",
      "enter-clabe-inline": "Enter CLABE/Card",
      "complete-payment": "Complete payment",
      "edit": "Edit",
      "change-recipient": "Change recipient",
      "change-amount": "Change amount",
      "change-method": "Change method",
      "ask-recipient": "Call recipient",
      "switch-cash": "Switch to Cash Pickup",
      "track": "Track",
      "recipients": "Recipients",
      "payment": "Payment",
      "rates": "Rates",
      "account": "Account",
      "faq": "FAQ",
      "history": "History",
      "add-recipient": "Add recipient",
      "support": "Support",
      "settings": "Settings",
      "refer-friend": "Refer friend",
    }

    if (optionId === "enter-details") {
      if (onTrackDetailsClick) {
        onTrackDetailsClick()
      }
      return
    } else if (optionId === "nudge-yes") {
      onSendMessage("Yes, I need help")
      return
    } else if (optionId === "nudge-no") {
      onSendMessage("No, I'm okay")
      return
    } else if (optionId === "enter-clabe-details") {
      window.postMessage({ type: "OPEN_CLABE_FLOW" }, "*")
    } else if (optionId === "enter-clabe-inline") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "complete-payment") {
      onSendMessage(buttonTextMap[optionId] || "complete-payment")
      // Open payment page after a short delay to ensure message is sent
      setTimeout(() => {
        window.open("https://transactflow.vercel.app/", "_blank")
      }, 100)
    } else if (optionId === "edit") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "change-recipient") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "change-amount") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "change-method") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "ask-recipient") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "switch-cash") {
      onSendMessage(buttonTextMap[optionId] || "CASH")
    } else if (optionId === "enter-clabe") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "confirm-location") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "enter-different") {
      onSendMessage(buttonTextMap[optionId] || optionId)
    } else if (optionId === "all-options") {
      onSendMessage("all-options")
    } else if (optionId === "track") {
      onSendMessage("/track")
    } else if (optionId === "recipients") {
      onSendMessage("/recipients")
    } else if (optionId === "payment") {
      onSendMessage("/payment")
    } else if (optionId === "rates") {
      onSendMessage("/rates")
    } else if (optionId === "account") {
      onSendMessage("/account")
    } else if (optionId === "faq") {
      onSendMessage("/faq")
    } else if (optionId === "history") {
      onSendMessage("/history")
    } else if (optionId === "add-recipient") {
      onSendMessage("/add-recipient")
    } else if (optionId === "support") {
      onSendMessage("/support")
    } else if (optionId === "settings") {
      onSendMessage("/settings")
    } else if (optionId === "refer-friend") {
      setShowReferModal(true)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-header-bg p-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-900/10 shrink-0"
            onClick={onOpenSidebar}
          >
            <BackArrowIcon />
          </Button>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h2 className="font-semibold text-gray-900 text-sm truncate">{contact.name}</h2>
              {contact.verified && <VerifiedIcon />}
            </div>
            <p className="text-xs text-gray-600 truncate">
              {contact.verified ? "Verified Business" : contact.online ? "online" : "last seen recently"}
            </p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {!contact.verified && (
            <>
              <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-900/10 h-9 w-9">
                <VideoIcon />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-900/10 h-9 w-9">
                <PhoneIcon />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 bg-chat-bg p-3 overflow-x-hidden" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"} w-full`}>
              {message.system ? (
                <div className="w-full flex justify-center">
                  <div className="max-w-[75%] rounded-lg px-3 py-2 bg-[#E7F8EE] text-foreground text-center">
                    <p className="text-xs leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ) : message.recipientConfirmation ? (
                <div className="w-full flex justify-start">
                  <div className="max-w-[90%] rounded-2xl p-4 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Got it:</h3>
                    <div className="mb-4 space-y-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">• Name:</span> {message.recipientConfirmation.name}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">• City/State/Country:</span>{" "}
                        {message.recipientConfirmation.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleRecipientConfirmClick("YES")}
                        className="w-full text-left px-4 py-3 rounded-xl border-2 bg-white border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <span className="text-base">✅ Yes, Correct</span>
                      </button>
                      <button
                        onClick={() => handleRecipientConfirmClick("NAME")}
                        className="w-full text-left px-4 py-3 rounded-xl border-2 bg-white border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <span className="text-base">✏️ Update name</span>
                      </button>
                      <button
                        onClick={() => handleRecipientConfirmClick("CITY")}
                        className="w-full text-left px-4 py-3 rounded-xl border-2 bg-white border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <span className="text-base">📍 Update location</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : message.interactive ? (
                <div className="w-full flex justify-start">
                  <div className="max-w-[90%] rounded-2xl p-4 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-sm text-foreground mb-3">
                      {parseTextWithFormatting(message.interactive.title).map((part, idx) =>
                        part.bold ? (
                          <strong key={idx}>{part.text}</strong>
                        ) : (
                          <span key={idx}>{part.text}</span>
                        )
                      )}
                    </h3>
                    {message.interactive.subtitle && message.interactive.subtitle.trim() && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {message.interactive.subtitle}
                      </p>
                    )}
                    {message.interactive.quote && (
                      <div className="mb-4 p-3 bg-gray-50 border-l-4 border-gray-300 rounded">
                        <p className="text-sm text-muted-foreground italic">{message.interactive.quote}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {message.interactive.options
                        .filter(option => option.id !== "all-options")
                        .map((option) => (
                          <div
                            key={option.id}
                            onClick={() => {
                              if (["send", "how", "compare"].includes(option.id)) {
                                onMenuOptionClick?.(option.id)
                              } else if (["cash", "bank", "wallet"].includes(option.id)) {
                                handleDeliveryMethodClick(option.id)
                              } else if (["50", "100", "200"].includes(option.id)) {
                                handleAmountClick(option.id)
                              } else if (
                                ["yes-correct", "no-change", "yes", "update-name", "update-location"].includes(option.id)
                              ) {
                                handleRecipientConfirmClick(option.id)
                              } else if (["clabe-yes", "clabe-no", "clabe-not-sure"].includes(option.id)) {
                                handleCLABEButtonClick(option.id)
                              } else if (["save-draft-yes", "save-draft-no"].includes(option.id)) {
                                onSendMessage(option.id === "save-draft-yes" ? "YES" : "NO")
                              } else if (
                                [
                                  "complete-payment",
                                  "edit",
                                  "change-recipient",
                                  "change-amount",
                                  "change-method",
                                  "ask-recipient",
                                  "switch-cash",
                                  "enter-clabe",
                                  "enter-details",
                                  "enter-clabe-details", // Added to button handler list
                                  "enter-clabe-inline", // Added for inline CLABE entry flow
                                  "confirm-location",
                                  "enter-different",
                                  "track",
                                  "recipients",
                                  "payment",
                                  "rates",
                                  "account",
                                  "faq",
                                  "history",
                                  "add-recipient",
                                  "support",
                                  "settings",
                                  "refer-friend",
                                ].includes(option.id)
                              ) {
                                handleActionButtonClick(option.id)
                              }
                            }}
                            className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <span className="text-sm">
                              {option.emoji} {option.label}
                            </span>
                          </div>
                        ))}
                    </div>
                    
                    {/* All options link - centered below the list */}
                    {message.interactive.options.some(option => option.id === "all-options") && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => {
                            setCurrentInteractiveMessage(message)
                            setShowInteractiveModal(true)
                          }}
                          className="text-[#25D366] hover:text-[#1ea952] font-medium text-base underline transition-colors flex items-center"
                        >
                          <div className="flex items-center mr-2">
                            <div className="w-4 h-4 flex flex-col justify-center">
                              <div className="w-3 h-0.5 bg-[#25D366] mb-0.5"></div>
                              <div className="w-3 h-0.5 bg-[#25D366] mb-0.5"></div>
                              <div className="w-3 h-0.5 bg-[#25D366]"></div>
                            </div>
                            <div className="w-1 h-1 bg-[#25D366] rounded-full ml-1"></div>
                          </div>
                          Options
                        </button>
                      </div>
                    )}
                    
                    {/* Type 'all' for more options text */}
                    {message.interactive.options.some(option => option.id === "all-options") && (
                      <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">Type "all" for more options.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : message.confirmation ? (
                <div className="w-full flex justify-start">
                  <div className="max-w-[90%] rounded-2xl p-5 bg-white shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <span className="text-2xl">📋</span>
                      <h3 className="text-base font-semibold text-gray-900">
                        Transaction Summary
                      </h3>
                    </div>
                    <div className="space-y-3 mb-4">
                      {message.confirmation.fields.map((field, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4">
                          <span className="text-sm text-gray-600 flex-shrink-0">{field.label}:</span>
                          <span className="text-sm font-semibold text-gray-900 text-right">{field.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {message.confirmation.prompt}
                      </p>
                      {message.confirmation.actions.map((action, idx) => (
                        <p key={idx} className="text-xs text-gray-500 mt-1">
                          {action}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : message.carousel ? (
                <div className="w-full max-w-[75%] overflow-hidden">
                  <div className="carousel-container flex gap-3 pb-2 snap-x snap-mandatory" style={{ width: '100%', maxWidth: '100%' }}>
                    {message.carousel.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-[240px] rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden snap-start"
                      >
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.title}
                          className="w-full h-[140px] object-cover"
                        />
                        <div className="p-3">
                          <h4 className="text-sm font-semibold text-foreground mb-2">{card.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-1">
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    message.sent ? "bg-message-sent text-foreground" : "bg-message-received text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {parseTextWithFormatting(message.text).map((part, idx) =>
                      part.bold ? (
                        <strong key={idx}>{part.text}</strong>
                      ) : (
                        <span key={idx}>{part.text}</span>
                      )
                    )}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    {message.sent && (
                      <span className="text-muted-foreground">
                        {message.read ? (
                          <span className="text-primary">
                            <CheckCheckIcon />
                          </span>
                        ) : (
                          <CheckIcon />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg px-3 py-2 bg-message-received">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-chat-bg p-3 safe-area-bottom">
        <div className="flex items-end gap-3">
          <button className="text-gray-700 hover:text-gray-900 shrink-0 p-0 mb-3">
            <PlusIcon />
          </button>
          <div className="flex-1 flex items-end gap-1 bg-white rounded-[18px] border-0 pl-6 pr-2 py-3 shadow-sm">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="flex-1 border-0 bg-transparent resize-none text-[15px] leading-relaxed p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[24px] max-h-[120px] placeholder:text-gray-400"
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:bg-transparent h-5 w-5 shrink-0 p-0 mb-0.5 ml-1"
            >
              <EditIcon />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-[#25D366] hover:bg-[#1ea952] h-[44px] w-[44px] rounded-full shrink-0 mb-1"
          >
            <SendIcon />
          </Button>
        </div>
      </div>

        {/* Interactive List Modal */}
        {showInteractiveModal && currentInteractiveMessage?.interactive && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white rounded-t-2xl w-full h-[700px] overflow-hidden animate-in slide-in-from-bottom duration-300">
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Let us know what you need help with
                  </h3>
                  <button
                    onClick={() => {
                      setShowInteractiveModal(false)
                      setCurrentInteractiveMessage(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto h-[620px]">
              {/* Refer Friends - Added at top */}
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("refer")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🎁</span>
                  <span className="text-base font-medium text-gray-900">Refer Friends, Earn Money</span>
                </div>
              </button>

              {/* Exchange Rates */}
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("rates")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🌎</span>
                  <span className="text-base font-medium text-gray-900">Check exchange rates</span>
                </div>
              </button>

              {/* All options without category headers */}
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("track")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">💸</span>
                  <span className="text-base font-medium text-gray-900">Track transfers</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("history")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🧾</span>
                  <span className="text-base font-medium text-gray-900">Recent transfers</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("recipients")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🫱</span>
                  <span className="text-base font-medium text-gray-900">View recipients</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("add-recipient")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">➕</span>
                  <span className="text-base font-medium text-gray-900">Add recipient</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("payment")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🏦</span>
                  <span className="text-base font-medium text-gray-900">Payment methods</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("faq")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">❓</span>
                  <span className="text-base font-medium text-gray-900">Frequently asked questions</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("support")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🆘</span>
                  <span className="text-base font-medium text-gray-900">Contact support</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowInteractiveModal(false)
                  setCurrentInteractiveMessage(null)
                  handleActionButtonClick("account")
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🪪</span>
                  <span className="text-base font-medium text-gray-900">Account</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refer Friend Modal */}
      {showReferModal && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-2xl w-full h-[500px] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Refer a friend
                </h3>
                <button
                  onClick={() => setShowReferModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Help your friend get started with Félix
              </p>
            </div>
            <div className="overflow-y-auto h-[420px]">
              <div className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={referForm.phoneNumber}
                    onChange={(e) => setReferForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={referForm.firstName}
                    onChange={(e) => setReferForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={referForm.lastName}
                    onChange={(e) => setReferForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (referForm.phoneNumber.trim()) {
                    // Handle referral submission
                    setShowReferModal(false)
                    setReferForm({ firstName: "", lastName: "", phoneNumber: "" })
                  }
                }}
                disabled={!referForm.phoneNumber.trim()}
                className="w-full bg-[#25D366] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1ea952] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
