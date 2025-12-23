"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { CompareRatesModal } from "./compare-rates-modal"
import { RecipientFlowPanel } from "./recipient-flow-panel"
import { ClabeFlowPanel } from "./clabe-flow-panel" // Import ClabeFlowPanel

export interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: number
  online?: boolean
  verified?: boolean
}

export interface Transfer {
  id: string
  firstName: string
  lastName: string
  location: string
  transferId: string
  transferDate: string
  amount: number
  currency: string
  status: 'complete' | 'in-progress' | 'failed'
}

export interface Message {
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

const contacts: Contact[] = [
  {
    id: "1",
    name: "Felix FTUX",
    avatar: "/felixicon.png",
    lastMessage: "Welcome! Let's send money to Mexico.",
    timestamp: "10:10 AM",
    online: true,
    verified: true,
  },
  {
    id: "2",
    name: "Felix Repeat UX",
    avatar: "/felixicon.png",
    lastMessage: "Ready to send again?",
    timestamp: "9:45 AM",
    online: true,
    verified: true,
  },
  {
    id: "3",
    name: "Felix Send Now, Pay Later",
    avatar: "/felixicon.png",
    lastMessage: "Send now, pay in installments.",
    timestamp: "9:15 AM",
    online: true,
    verified: true,
  },
  {
    id: "4",
    name: "Juan Pérez",
    avatar: "/man.jpg",
    lastMessage: "Gracias por el envío",
    timestamp: "Yesterday",
    online: false,
  },
  {
    id: "5",
    name: "Ana Silva",
    avatar: "/woman-2.jpg",
    lastMessage: "Recibí el dinero, muchas gracias",
    timestamp: "Yesterday",
    unread: 1,
  },
  {
    id: "6",
    name: "María García",
    avatar: "/diverse-woman-portrait.png",
    lastMessage: "Todo perfecto",
    timestamp: "Monday",
  },
  {
    id: "7",
    name: "Carlos Rodríguez",
    avatar: "/man-2.jpg",
    lastMessage: "Confirmado",
    timestamp: "Monday",
  },
]

// Mock transfer data
const mockTransfers: Transfer[] = [
  {
    id: "1",
    firstName: "Maria",
    lastName: "Garcia",
    location: "Guadalajara, Mexico",
    transferId: "FX-2024-001234",
    transferDate: "2024-01-15",
    amount: 250.00,
    currency: "USD",
    status: "complete"
  },
  {
    id: "2",
    firstName: "Carlos",
    lastName: "Rodriguez",
    location: "Mexico City, Mexico",
    transferId: "FX-2024-001235",
    transferDate: "2024-01-14",
    amount: 150.00,
    currency: "USD",
    status: "in-progress"
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "Lopez",
    location: "Tijuana, Mexico",
    transferId: "FX-2024-001236",
    transferDate: "2024-01-13",
    amount: 300.00,
    currency: "USD",
    status: "failed"
  },
  {
    id: "4",
    firstName: "Maria",
    lastName: "Hernandez",
    location: "Monterrey, Mexico",
    transferId: "FX-2024-001237",
    transferDate: "2024-01-12",
    amount: 200.00,
    currency: "USD",
    status: "complete"
  },
  {
    id: "5",
    firstName: "Jose",
    lastName: "Martinez",
    location: "Cancun, Mexico",
    transferId: "FX-2024-001238",
    transferDate: "2024-01-11",
    amount: 175.00,
    currency: "USD",
    status: "complete"
  }
]

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "This business uses a secure service from Meta to manage this chat. Tap to learn more.",
      timestamp: "Today",
      sent: false,
      system: true,
    },
  ],
  "2": [
    { id: "1", text: "Did you get the files I sent?", timestamp: "9:00 AM", sent: false },
    { id: "2", text: "Yes, reviewing them now", timestamp: "9:10 AM", sent: true, read: true },
    { id: "3", text: "Thanks for the update", timestamp: "9:15 AM", sent: false },
  ],
  "3": [
    { id: "1", text: "Hi! About our meeting tomorrow...", timestamp: "2:30 PM", sent: false },
    { id: "2", text: "Can we reschedule?", timestamp: "2:31 PM", sent: false },
  ],
}

const initialInputValues: Record<string, string> = {
  "1": "Hi, I want to take advantage of my first transfer with no commission and a great exchange rate to Mexico. 🇲🇽",
}

const COMMON_LOCATIONS = [
  // Mexico
  { city: "guadalajara", state: "JAL", country: "Mexico", fullName: "Guadalajara, JAL, Mexico" },
  { city: "mexico city", state: "CDMX", country: "Mexico", fullName: "Mexico City, CDMX, Mexico" },
  { city: "monterrey", state: "NL", country: "Mexico", fullName: "Monterrey, NL, Mexico" },
  { city: "puebla", state: "PUE", country: "Mexico", fullName: "Puebla, PUE, Mexico" },
  { city: "tijuana", state: "BC", country: "Mexico", fullName: "Tijuana, BC, Mexico" },
  { city: "cancun", state: "Q.ROO", country: "Mexico", fullName: "Cancun, Q.ROO, Mexico" },
  { city: "merida", state: "YUC", country: "Mexico", fullName: "Merida, YUC, Mexico" },
  { city: "queretaro", state: "QRO", country: "Mexico", fullName: "Queretaro, QRO, Mexico" },
  { city: "leon", state: "GTO", country: "Mexico", fullName: "Leon, GTO, Mexico" },
  { city: "juarez", state: "CHIH", country: "Mexico", fullName: "Juarez, CHIH, Mexico" },

  // Peru
  { city: "lima", state: "Lima", country: "Peru", fullName: "Lima, Lima, Peru" },
  { city: "arequipa", state: "Arequipa", country: "Peru", fullName: "Arequipa, Arequipa, Peru" },
  { city: "cusco", state: "Cusco", country: "Peru", fullName: "Cusco, Cusco, Peru" },
  { city: "trujillo", state: "La Libertad", country: "Peru", fullName: "Trujillo, La Libertad, Peru" },

  // Colombia
  { city: "bogota", state: "Cundinamarca", country: "Colombia", fullName: "Bogota, Cundinamarca, Colombia" },
  { city: "medellin", state: "Antioquia", country: "Colombia", fullName: "Medellin, Antioquia, Colombia" },
  { city: "cali", state: "Valle del Cauca", country: "Colombia", fullName: "Cali, Valle del Cauca, Colombia" },
  { city: "cartagena", state: "Bolivar", country: "Colombia", fullName: "Cartagena, Bolivar, Colombia" },

  // Other Latin American cities
  {
    city: "buenos aires",
    state: "Buenos Aires",
    country: "Argentina",
    fullName: "Buenos Aires, Buenos Aires, Argentina",
  },
  { city: "santiago", state: "Santiago", country: "Chile", fullName: "Santiago, Santiago, Chile" },
  { city: "quito", state: "Pichincha", country: "Ecuador", fullName: "Quito, Pichincha, Ecuador" },
  { city: "san jose", state: "San Jose", country: "Costa Rica", fullName: "San Jose, San Jose, Costa Rica" },
]

function findLocationSuggestion(
  partialCity: string,
): { city: string; state: string; country: string; fullName: string } | null {
  const normalized = partialCity.toLowerCase().trim()
  const match = COMMON_LOCATIONS.find((loc) => loc.city === normalized || loc.city.includes(normalized))
  return match || null
}

export function WhatsAppChat() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [hasReceivedFirstMessage, setHasReceivedFirstMessage] = useState<Record<string, boolean>>({})
  const [userHasSentMessage, setUserHasSentMessage] = useState(false)
  const [prototypeComplete, setPrototypeComplete] = useState(false)
  const [currentFlow, setCurrentFlow] = useState<"initial" | "sendMoney" | "bankCard">("initial")
  const [isTyping, setIsTyping] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [showRecipientFlowPanel, setShowRecipientFlowPanel] = useState(false)
  const [showClabeFlowPanel, setShowClabeFlowPanel] = useState(false)
  const [showTrackDetailsModal, setShowTrackDetailsModal] = useState(false)
  const [trackDetailsForm, setTrackDetailsForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "Select",
    country: "Mexico"
  })
  const [showReferModal, setShowReferModal] = useState(false)
  const [referForm, setReferForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [recipientFlowContactId, setRecipientFlowContactId] = useState<string | null>(null)
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)
  const [hasShownNudge, setHasShownNudge] = useState<Record<string, boolean>>({})
  const [conversationState, setConversationState] = useState<
    Record<
      string,
      {
        step:
          | "idle"
          | "awaiting_recipient"
          | "awaiting_recipient_confirmation" // Added state
          | "awaiting_location_confirmation" // Added state
          | "awaiting_amount"
          | "awaiting_method"
          | "awaiting_clabe_check"
          | "awaiting_clabe"
          | "confirming"
          | "awaiting_completion" // Added state
          | "awaiting_save_recipient" // Added state for save recipient prompt
        data: {
          recipientName?: string
          city?: string
          state?: string
          country?: string
          amount?: string
          currency?: string
          method?: string
          clabe?: string
          partialCity?: string // Added field for partial city input
          accountNumber?: string // Added field for account number
          deliveryMethod?: string // Added field for delivery method
          exchangeRate?: string // Added field for exchange rate
          bankName?: string // Added field for bank name
        }
        isEditing?: boolean
      }
    >
  >({})

  const activeContact = selectedContact.id

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Helper function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PAYMENT_COMPLETE") {
        // Show save recipient prompt after payment completion
        const contactId = activeContact
        const currentState = conversationState[contactId]

        if (currentState && currentState.data.recipientName) {
          setTimeout(() => {
            setIsTyping(true)
            setTimeout(() => {
              setIsTyping(false)

              const newMessage: Message = {
                id: Date.now().toString(),
                text: "",
                timestamp: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
                sent: false,
                interactive: {
                  title: "Add a nickname",
                  subtitle: "Send money faster — only you will see it in Félix.",
                  quote: '💬 Ex: "Mom," "Cousin Juan," or "Jean MX"',
                  options: [],
                },
              }

              setMessages((prev) => ({
                ...prev,
                [contactId]: [...(prev[contactId] || []), newMessage],
              }))

              setConversationState((prev) => ({
                ...prev,
                [contactId]: {
                  ...prev[contactId],
                  step: "awaiting_save_recipient",
                },
              }))
            }, 1500)
          }, 800)
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [activeContact, conversationState])

  const showTransactionSummaryAndActions = async (contactId: string) => {
    const currentState = conversationState[contactId]
    const data = currentState.data

    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    const exchangeRate = Number.parseFloat(data.exchangeRate || "18.42")
    const amountNum = Number.parseFloat(data.amount || "0")
    const mxnAmount = data.currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : data.amount

    let deliveryMethodText = ""
    if (data.method === "CASH") {
      deliveryMethodText = "Cash Pickup (OXXO/7-Eleven)"
    } else if (data.method === "BANK" && data.accountNumber) {
      const is18Digit = data.accountNumber.length === 18
      const bankCodes: Record<string, string> = {
        "002": "Banamex",
        "012": "BBVA",
        "014": "Santander",
        "019": "Banjercito",
        "021": "HSBC",
        "030": "Bajío",
        "032": "IXE",
        "036": "Inbursa",
        "037": "Interacciones",
        "042": "Mifel",
        "044": "Scotiabank",
        "058": "BanRegio",
        "059": "Invex",
        "060": "Bansi",
        "062": "Afirme",
        "072": "Banorte",
        "102": "The Royal Bank",
        "103": "American Express",
        "106": "Bank of America",
        "108": "Bank of Tokyo",
        "110": "JP Morgan",
        "112": "Bmonex",
        "113": "Ve Por Mas",
        "116": "ING",
        "124": "Deutsche",
        "126": "Credit Suisse",
        "127": "Azteca",
        "128": "Autofin",
        "130": "Barclays",
        "131": "Compartamos",
        "132": "Banco Famsa",
        "133": "GE Money",
        "134": "Walmart",
        "135": "Nafin",
        "136": "Interbanco",
        "137": "Bancoppel",
        "138": "ABC Capital",
        "139": "UBS Bank",
        "140": "Consubanco",
        "141": "Volkswagen",
        "143": "CIBanco",
        "145": "Bbase",
        "147": "Bankaool",
        "148": "PagaTodo",
        "150": "Inmobiliario",
        "151": "Donde",
        "152": "Bancrea",
        "154": "Banco Finterra",
        "155": "ICBC",
        "156": "Sabadell",
        "157": "Shinhan",
        "158": "Mizuho Bank",
        "159": "Bank of China",
        "160": "Banco S3",
        "166": "BanBajio",
        "168": "Hipotecario Federal",
        "600": "GBM",
        "601": "Monexcb",
        "602": "Masari",
        "605": "Value",
        "606": "Estructuradores",
        "607": "Tiber",
        "608": "Vector",
        "610": "B&B",
        "614": "Accival",
        "616": "Finamex",
        "617": "Valmex",
        "618": "Unica",
        "619": "Mapfre",
        "620": "Profuturo",
        "621": "CB Actinver",
        "622": "Oactin",
        "623": "Skandia",
        "626": "Cbdeutsche",
        "627": "Zurich",
        "628": "Zurichvi",
        "629": "Hipotecaria Su Casita",
        "630": "CB Intercam",
        "631": "CI Bolsa",
        "632": "Bulltick CB",
        "633": "Sterling",
        "634": "Fincomun",
        "636": "HDI Seguros",
        "637": "Order",
        "638": "Akala",
        "640": "JP Morgan CB",
        "642": "Reforma",
        "646": "STP",
        "647": "Telecomm",
        "648": "Evercore",
        "649": "Skandia",
        "651": "Segmty",
        "652": "Asea",
        "653": "Kuspit",
        "655": "Sofiexpress",
        "656": "Unagra",
        "659": "Opciones Empresariales del Noreste",
        "670": "Libertad",
        "901": "CLS",
        "902": "INDEVAL",
      }
      const bankCode = is18Digit ? data.accountNumber.substring(0, 3) : ""
      const detectedBank = is18Digit ? bankCodes[bankCode] || "Unknown Bank" : "Debit/Credit Card"
      deliveryMethodText = detectedBank
    }

    const lastFourDigits = data.accountNumber?.slice(-4) || '0000'
    const cardType = data.accountNumber?.length === 18 ? 'CLABE' : 'Card'

    const receiptMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: `*🤝 Great, ${data.recipientName?.split(' ')[0] || 'they'} will receive $${Number(mxnAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN today*\n\n*Here's how it breaks down:*\n\n• You're sending: $${data.amount} USD\n• Rate: ${exchangeRate} MXN per USD\n• Fee: $0 (first transfer free 🎉)\n• Destination: ${deliveryMethodText || 'Bank'}\n• ${cardType}: ••••${lastFourDigits}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), receiptMessage],
    }))

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(false)

    const actionMenu: Message = {
      id: Date.now().toString() + Math.random(),
      text: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
      interactive: {
        title: "What would you like to do?",
        subtitle: "",
        options: [
          { id: "complete-payment", label: "Complete Payment", emoji: "✅" },
          { id: "edit", label: "Edit Transaction", emoji: "✏️" },
        ],
      },
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), actionMenu],
    }))
  }

  const sendBotResponses = async (contactId: string) => {
    const botMessages = [
      {
        text: "👋 Welcome! Over 500,000 people send money with Félix every month.",
        delay: 2000,
      },
      {
        text: "We'll ensure your money reaches the right person, securely.",
        delay: 2500,
      },
      {
        text: "Today's exchange rate is 18.42 pesos per dollar",
        delay: 2500,
      },
      {
        text: "No fees on your first transfer. 💪",
        delay: 2000,
      },
    ]

    for (const botMsg of botMessages) {
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, botMsg.delay))
      setIsTyping(false)

      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: botMsg.text,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), newMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTyping(false)

    const menuMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
      interactive: {
        title: "*What would you like to do?*",
        subtitle: "",
        options: [
          { id: "send", label: "Send Money", emoji: "💵" },
          { id: "how", label: "How Félix works", emoji: "💎", selected: true },
          { id: "compare", label: "Compare Rates", emoji: "📊" },
        ],
      },
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), menuMessage],
    }))

    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTyping(false)

    const proTipMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: "💡 *Pro Tip:* Tap the buttons or type a reply (e.g. send 100 USD)",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), proTipMessage],
    }))
  }

  // Helper function to show transaction receipt and action menu
  const showTransactionReceipt = async (contactId: string, data: Record<string, any>) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    const exchangeRate = Number.parseFloat(data.exchangeRate || "18.42")
    const amountNum = Number.parseFloat(data.amount || "0")
    const mxnAmount = data.currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : data.amount

    let deliveryMethodText = ""
    if (data.method === "CASH") {
      deliveryMethodText = "Cash Pickup (OXXO/7-Eleven)"
    } else if (data.method === "BANK" && data.accountNumber) {
      const is18Digit = data.accountNumber.length === 18
      const bankCodes: Record<string, string> = {
        "002": "Banamex",
        "012": "BBVA",
        "014": "Santander",
        "019": "Banjercito",
        "021": "HSBC",
        "030": "Bajío",
        "032": "IXE",
        "036": "Inbursa",
        "037": "Interacciones",
        "042": "Mifel",
        "044": "Scotiabank",
        "058": "BanRegio",
        "059": "Invex",
        "060": "Bansi",
        "062": "Afirme",
        "072": "Banorte",
        "102": "The Royal Bank",
        "103": "American Express",
        "106": "Bank of America",
        "108": "Bank of Tokyo",
        "110": "JP Morgan",
        "112": "Bmonex",
        "113": "Ve Por Mas",
        "116": "ING",
        "124": "Deutsche",
        "126": "Credit Suisse",
        "127": "Azteca",
        "128": "Autofin",
        "130": "Barclays",
        "131": "Compartamos",
        "132": "Banco Famsa",
        "133": "GE Money",
        "134": "Walmart",
        "135": "Nafin",
        "136": "Interbanco",
        "137": "Bancoppel",
        "138": "ABC Capital",
        "139": "UBS Bank",
        "140": "Consubanco",
        "141": "Volkswagen",
        "143": "CIBanco",
        "145": "Bbase",
        "147": "Bankaool",
        "148": "PagaTodo",
        "150": "Inmobiliario",
        "151": "Donde",
        "152": "Bancrea",
        "154": "Banco Finterra",
        "155": "ICBC",
        "156": "Sabadell",
        "157": "Shinhan",
        "158": "Mizuho Bank",
        "159": "Bank of China",
        "160": "Banco S3",
        "166": "BanBajio",
        "168": "Hipotecario Federal",
        "600": "GBM",
        "601": "Monexcb",
        "602": "Masari",
        "605": "Value",
        "606": "Estructuradores",
        "607": "Tiber",
        "608": "Vector",
        "610": "B&B",
        "614": "Accival",
        "616": "Finamex",
        "617": "Valmex",
        "618": "Unica",
        "619": "Mapfre",
        "620": "Profuturo",
        "621": "CB Actinver",
        "622": "Oactin",
        "623": "Skandia",
        "626": "Cbdeutsche",
        "627": "Zurich",
        "628": "Zurichvi",
        "629": "Hipotecaria Su Casita",
        "630": "CB Intercam",
        "631": "CI Bolsa",
        "632": "Bulltick CB",
        "633": "Sterling",
        "634": "Fincomun",
        "636": "HDI Seguros",
        "637": "Order",
        "638": "Akala",
        "640": "JP Morgan CB",
        "642": "Reforma",
        "646": "STP",
        "647": "Telecomm",
        "648": "Evercore",
        "649": "Skandia",
        "651": "Segmty",
        "652": "Asea",
        "653": "Kuspit",
        "655": "Sofiexpress",
        "656": "Unagra",
        "659": "Opciones Empresariales del Noreste",
        "670": "Libertad",
        "901": "CLS",
        "902": "INDEVAL",
      }
      const bankCode = is18Digit ? data.accountNumber.substring(0, 3) : ""
      const detectedBank = is18Digit ? bankCodes[bankCode] || "Unknown Bank" : "Debit/Credit Card"
      deliveryMethodText = detectedBank
    }

    const lastFourDigits = data.accountNumber?.slice(-4) || '0000'
    const cardType = data.accountNumber?.length === 18 ? 'CLABE' : 'Card'

    const receiptMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: `*🤝 Great, ${data.recipientName?.split(' ')[0] || 'they'} will receive $${Number(mxnAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN today*\n\n*Here's how it breaks down:*\n\n• You're sending: $${data.amount} USD\n• Rate: ${exchangeRate} MXN per USD\n• Fee: $0 (first transfer free 🎉)\n• Destination: ${deliveryMethodText || 'Bank'}\n• ${cardType}: ••••${lastFourDigits}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), receiptMessage],
    }))

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(false)

    const actionMenu: Message = {
      id: Date.now().toString() + Math.random(),
      text: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
      interactive: {
        title: "What would you like to do?",
        subtitle: "",
        options: [
          { id: "complete-payment", label: "Complete Payment", emoji: "✅" },
          { id: "edit", label: "Edit Transaction", emoji: "✏️" },
        ],
      },
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), actionMenu],
    }))
  }

  // Function to search transfers by partial data
  const searchTransfers = (searchTerm: string): Transfer[] => {
    if (!searchTerm.trim()) return []
    
    const normalizedSearch = searchTerm.toLowerCase().trim()
    
    return mockTransfers
      .filter(transfer => 
        transfer.firstName.toLowerCase().includes(normalizedSearch) ||
        transfer.lastName.toLowerCase().includes(normalizedSearch) ||
        transfer.location.toLowerCase().includes(normalizedSearch) ||
        transfer.transferId.toLowerCase().includes(normalizedSearch)
      )
      .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
      .slice(0, 3) // Return max 3 results
  }

  // Function to handle track details form submission
  const handleTrackDetailsSubmit = async (contactId: string) => {
    const { firstName, lastName, city, state, country } = trackDetailsForm
    
    // Create search term from filled fields
    const location = [city, state, country].filter(s => s && s !== "Select").join(", ")
    const searchTerms = [firstName, lastName, location]
      .filter(term => term.trim() !== "")
      .join(" ")
    
    if (searchTerms.trim() === "") {
      // If no fields are filled, show error
      const errorMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "Please fill out at least one field to search for transfers.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }
      
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), errorMessage],
      }))
      return
    }
    
    // Search for transfers
    const searchResults = searchTransfers(searchTerms)
    
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)
    
    const transferResponse = createTransferResponseMessage(searchResults)
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), transferResponse],
    }))
    
    // Reset form and close modal
    setTrackDetailsForm({ firstName: "", lastName: "", city: "", state: "Select", country: "Mexico" })
    setShowTrackDetailsModal(false)
  }

  // Function to create nudge message
  const createNudgeMessage = (): Message => {
    return {
      id: Date.now().toString() + Math.random(),
      text: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
      interactive: {
        title: "Do you need help?",
        subtitle: "We noticed you've been idle for a bit.",
        options: [
          { id: "nudge-yes", label: "🤝 Yes, I need help", emoji: "" },
          { id: "nudge-no", label: "👍 No, I'm okay", emoji: "" },
        ],
      },
    }
  }

  // Function to start inactivity timer
  const startInactivityTimer = (contactId: string) => {
    // Clear existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    // Don't show nudge if already shown for this contact
    if (hasShownNudge[contactId]) {
      return
    }

    const timer = setTimeout(async () => {
      // Check if user is still on this contact, hasn't shown nudge, and has sent first message
      if (activeContact === contactId && !hasShownNudge[contactId] && hasReceivedFirstMessage[contactId]) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const nudgeMessage = createNudgeMessage()
        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), nudgeMessage],
        }))

        // Mark nudge as shown for this contact
        setHasShownNudge(prev => ({ ...prev, [contactId]: true }))
      }
    }, 90000) // 90 seconds

    setInactivityTimer(timer)
  }

  // Function to create transfer response message
  const createTransferResponseMessage = (transfers: Transfer[]): Message => {
    if (transfers.length === 0) {
      return {
        id: Date.now().toString() + Math.random(),
        text: "No transfers found matching your search. Please try different search terms or contact support for assistance.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }
    }

    const hasFailedTransfer = transfers.some(t => t.status === 'failed')
    let responseText = `Found ${transfers.length} transfer${transfers.length > 1 ? 's' : ''}:\n\n`
    
    transfers.forEach((transfer, index) => {
      const statusEmoji = transfer.status === 'complete' ? '✅' : 
                         transfer.status === 'in-progress' ? '⏳' : '❌'
      const statusText = transfer.status === 'complete' ? 'Complete' : 
                        transfer.status === 'in-progress' ? 'In Progress' : 'Failed'
      
      responseText += `${index + 1}. ${transfer.firstName} ${transfer.lastName}\n`
      responseText += `   📍 ${transfer.location}\n`
      responseText += `   🆔 ${transfer.transferId}\n`
      responseText += `   📅 ${new Date(transfer.transferDate).toLocaleDateString()}\n`
      responseText += `   💰 $${transfer.amount.toFixed(2)} ${transfer.currency}\n`
      responseText += `   ${statusEmoji} ${statusText}\n\n`
    })

    if (hasFailedTransfer) {
      responseText += "⚠️ One or more transfers have failed. Please contact support for assistance with failed transfers."
    }

    return {
      id: Date.now().toString() + Math.random(),
      text: responseText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
    }
  }

  const handleRemittanceFlow = async (contactId: string, userMessage: string) => {
    const currentState = conversationState[contactId] || { step: "idle", data: {}, isEditing: false }
    const normalizedMessage = userMessage.toLowerCase().trim()

        // Handle track command
        if (
          normalizedMessage === "track" ||
          normalizedMessage === "/track" ||
          normalizedMessage === "track a transfer" ||
          normalizedMessage === "track transfer"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          setIsTyping(true)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setIsTyping(false)

          const trackMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text: "",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            sent: false,
            read: false,
            interactive: {
              title: "Let us help you check transfer status",
              subtitle: "Respond with the recipient name, tracking # or location or tap 'enter details below'. Alternatively, type 'view recent transfers' to see the last 5 transfers.",
              options: [
                { id: "enter-details", label: "✏️ Enter details", emoji: "" },
              ],
            },
          }

          setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), trackMessage],
          }))
          return true
        }

        // Handle nudge responses and help command
        if (normalizedMessage === "nudge-yes" || normalizedMessage === "yes, i need help" || normalizedMessage === "help" || normalizedMessage === "/help") {
          await new Promise((resolve) => setTimeout(resolve, 800))
          setIsTyping(true)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setIsTyping(false)

          const helpMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text: "",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            sent: false,
            read: false,
            interactive: {
              title: "Type any of the below 👇",
              subtitle: "Try \"track\", \"/track\", or \"track a transfer\" — Félix understands them all.",
              options: [
                { id: "track", label: "💸 Track a transfer", emoji: "" },
                { id: "recipients", label: "👥 Manage recipients", emoji: "" },
                { id: "payment", label: "💳 Update method", emoji: "" },
                { id: "rates", label: "🇲🇽 Check rates", emoji: "" },
                { id: "refer", label: "🎁 Refer & earn", emoji: "" },
                { id: "faq", label: "🧠 Learn about Félix", emoji: "" },
                { id: "all-options", label: "Options", emoji: "" },
              ],
            },
          }

          setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), helpMessage],
          }))
          return true
        }

        if (normalizedMessage === "nudge-no" || normalizedMessage === "no, i'm okay") {
          await new Promise((resolve) => setTimeout(resolve, 800))
          setIsTyping(true)
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setIsTyping(false)

          const thanksMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text: "Thanks! Feel free to type 'help' at any time if you need assistance.",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            sent: false,
            read: false,
          }

          setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), thanksMessage],
          }))
          return true
        }

        // Handle partial data search for transfers
        const searchResults = searchTransfers(userMessage)
        if (searchResults.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          setIsTyping(true)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setIsTyping(false)

          const transferResponse = createTransferResponseMessage(searchResults)
          setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), transferResponse],
          }))
          return true
        }

    // Handle "All options" expanded help
    if (normalizedMessage === "all" || normalizedMessage === "all-options") {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const expandedHelpMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "All Help Options",
          subtitle: "Choose a category or specific command:",
          options: [
            { id: "track", label: "💸 Track a transfer", emoji: "" },
            { id: "history", label: "📋 View recent transfers", emoji: "" },
            { id: "recipients", label: "👥 See recipients", emoji: "" },
            { id: "add-recipient", label: "➕ Add Recipient", emoji: "" },
            { id: "payment", label: "💳 Manage payment method", emoji: "" },
            { id: "faq", label: "🧠 FAQ: How Felix works", emoji: "" },
            { id: "rates", label: "🇲🇽 Exchange rates", emoji: "" },
            { id: "support", label: "🆘 Contact support", emoji: "" },
            { id: "account", label: "🪪 My account", emoji: "" },
            { id: "settings", label: "⚙️ Settings", emoji: "" },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), expandedHelpMessage],
      }))
      return true
    }

    // </CHANGE> Added handler for complete-payment message
    if (normalizedMessage === "complete-payment" || normalizedMessage === "complete payment") {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsTyping(false)

      const paymentOnWayMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "Your payment is on it's way!",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), paymentOnWayMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const recipientName = conversationState[contactId]?.data?.recipientName?.split(' ')[0] || 'them'
      const fasterTransferMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: `Make your next transfer with ${recipientName} faster.`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), fasterTransferMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const saveRecipientMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Easily reference them next time.",
          subtitle: "Give them a short name (optional)",
          quote: 'e.g. Cousin Juan, Juan MX-CDMX, Juan PV',
          options: [],
        },
      }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), saveRecipientMessage],
        }))

      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_save_recipient", data: { ...prev[contactId]?.data }, isEditing: false },
      }))
      return true
    }

    if (normalizedMessage === "edit") {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const editMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "What would you like to change?",
          subtitle: "Type a response or choose an option below",
          options: [
            { id: "change-recipient", label: "Beneficiary", emoji: "👤" },
            { id: "change-amount", label: "Amount", emoji: "💸" },
            { id: "change-method", label: "Delivery Method", emoji: "🔄" },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), editMessage],
      }))
      return true
    }

    if (normalizedMessage === "change-recipient") {
      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_recipient", data: { ...prev[contactId]?.data }, isEditing: true },
      }))

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const recipientMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: 'Who are you sending to? Write it like this: "Full Name, City, State/Province, Country".\n\nEx: "Juan Pérez, Guadalajara, JAL, Mexico" | "Ana Silva, Lima, Lima, Peru"',
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), recipientMessage],
      }))
      return true
    }

    if (normalizedMessage === "change-amount") {
      const recipientName = conversationState[contactId]?.data?.recipientName || "them"
      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_amount", data: { ...prev[contactId]?.data }, isEditing: true },
      }))

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      // First message: Ask how much
      const questionMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: `Ok, how much do you want to send to ${recipientName}?`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), questionMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(false)

      // Second message: Amount options
      const amountMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Choose or type a custom amount",
          subtitle: "",
          options: [
            { id: "50", label: "💵 $50 USD (921 pesos)", emoji: "" },
            { id: "100", label: "💵 $100 USD (1,842 pesos)", emoji: "" },
            { id: "200", label: "💵 $200 USD (3,684 pesos)", emoji: "" },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), amountMessage],
      }))
      return true
    }

    if (normalizedMessage === "change-method") {
      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_method", data: { ...prev[contactId]?.data }, isEditing: true },
      }))

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      // First message: Ask how they want to receive
      const questionMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "How do they want to receive their money?",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), questionMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(false)

      // Second message: Method options
      const methodMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Choose or type a delivery method",
          subtitle: "",
          options: [
            { id: "cash", label: "Cash Pickup", emoji: "💵" },
            { id: "bank", label: "Bank/Card", emoji: "🏦" },
            { id: "wallet", label: "Digital Wallet", emoji: "📱" },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), methodMessage],
      }))
      return true
    }

    if (normalizedMessage === "send money" && currentState.step === "idle") {
      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_recipient", data: {} },
      }))

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const recipientCard: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Who would you like to send money to?",
          subtitle: 'Write it like this: "Full Name, City, State/Province, Country".',
          quote: 'Ex: "Juan Pérez, Guadalajara, JAL, Mexico" | "Ana Silva, Lima, Lima, Peru"',
          options: [{ id: "enter-details", label: "Enter Details", emoji: "✏️" }],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), recipientCard],
      }))
      return true
    }

    if (normalizedMessage === "enter-details") {
      setRecipientFlowContactId(contactId)
      setShowRecipientFlowPanel(true)
      return true
    }

    if (currentState.step === "awaiting_recipient") {
      const parts = userMessage.split(",").map((p) => p.trim())

      // Merge with existing data
      let recipientName = currentState.data.recipientName || ""
      let city = currentState.data.city || ""
      let state = currentState.data.state || ""
      let country = currentState.data.country || "Mexico" // Default to Mexico if not provided

      let shouldSuggestLocation = false
      let suggestedLocation: { city: string; state: string; country: string; fullName: string } | null = null

      // If message has commas, it's likely formatted input
      if (parts.length > 1) {
        // Full format: Name, City, State, Country
        if (parts.length >= 4) {
          recipientName = parts[0]
          city = parts[1]
          state = parts[2]
          country = parts[3]
        }
        // Three parts: could be "Name, City, State" (missing country)
        else if (parts.length === 3) {
          if (!recipientName) {
            // This is "Name, City, State" format - missing country
            recipientName = parts[0]
            city = parts[1]
            state = parts[2]
            // Try to find a matching location with this city and state
            const cityStateLower = `${city.toLowerCase().trim()}`
            suggestedLocation =
              COMMON_LOCATIONS.find(
                (loc) => loc.city === cityStateLower && loc.state.toLowerCase() === state.toLowerCase().trim(),
              ) || null
            if (suggestedLocation) {
              shouldSuggestLocation = true
            }
          } else {
            // We already have a name, so this is "City, State, Country"
            city = parts[0]
            state = parts[1]
            country = parts[2]
          }
        }
        // Partial: could be City, State or Name, City
        else if (parts.length === 2) {
          if (!recipientName) {
            recipientName = parts[0]
            city = parts[1]
            suggestedLocation = findLocationSuggestion(city)
            if (suggestedLocation) {
              shouldSuggestLocation = true
            }
          } else {
            // We have a name, so this is "City, State" - missing country
            city = parts[0]
            state = parts[1]
            // Try to find a matching location with this city and state
            const cityStateLower = `${city.toLowerCase().trim()}`
            suggestedLocation =
              COMMON_LOCATIONS.find(
                (loc) => loc.city === cityStateLower && loc.state.toLowerCase() === state.toLowerCase().trim(),
              ) || null
            if (suggestedLocation) {
              shouldSuggestLocation = true
            }
          }
        }
      } else {
        // Single value - if we don't have a name yet, this is the name
        if (!recipientName) {
          recipientName = userMessage
        } else {
          // Otherwise, treat as city
          city = userMessage
          suggestedLocation = findLocationSuggestion(city)
          if (suggestedLocation) {
            shouldSuggestLocation = true
          }
        }
      }

      const hasName = recipientName.trim().length > 0
      const hasLocation = city.trim().length > 0

      setConversationState((prev) => ({
        ...prev,
        [contactId]: {
          step: shouldSuggestLocation ? "awaiting_location_confirmation" : "awaiting_recipient",
          data: {
            recipientName,
            city: shouldSuggestLocation ? suggestedLocation!.city : city,
            state: shouldSuggestLocation ? suggestedLocation!.state : state,
            country: shouldSuggestLocation ? suggestedLocation!.country : country,
            partialCity: shouldSuggestLocation ? city : undefined,
          },
          isEditing: prev[contactId]?.isEditing || false,
        },
      }))

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      if (shouldSuggestLocation && suggestedLocation) {
        const suggestionMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Did you mean?",
            subtitle: `${recipientName}, ${suggestedLocation.fullName}`,
            options: [
              { id: "confirm-location", label: "Yes, that's correct", emoji: "✅" },
              { id: "enter-different", label: "No, enter different location", emoji: "📍" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), suggestionMessage],
        }))
        return true
      }

      if (!hasName) {
        // Ask for name
        const askNameMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "Got it! Now, what's the recipient's full name?",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), askNameMessage],
        }))
      } else if (!hasLocation) {
        // Ask for location
        const askLocationMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: `Got it! Now, where is ${recipientName} located? Please provide: City, State, Country\n\nEx: "Guadalajara, JAL, Mexico"`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), askLocationMessage],
        }))
      } else {
        // All required info present, show confirmation
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_recipient_confirmation",
            data: { recipientName, city, state, country },
            isEditing: prev[contactId]?.isEditing || false,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const confirmMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Confirm Recipient",
            subtitle: `Is this correct? ${recipientName}, ${city}, ${state}, ${country}`,
            options: [
              { id: "yes-correct", label: "Yes, Correct", emoji: "✅" },
              { id: "no-change", label: "No, Change", emoji: "❌" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), confirmMessage],
        }))
      }
      return true
    }

    if (currentState.step === "awaiting_recipient_confirmation") {
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage === "yes-correct" || lowerMessage === "yes" || lowerMessage === "correct") {
        // Proceed to amount selection
        if (currentState.isEditing) {
          await showTransactionSummaryAndActions(contactId)
          return true
        }

        const recipientName = currentState.data.recipientName || "them"

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_amount",
            data: prev[contactId].data,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        // First message: Ask how much
        const questionMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: `Ok, how much do you want to send to ${recipientName}?`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), questionMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        // Second message: Amount options
        const amountMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Choose or type a custom amount",
            subtitle: "",
            options: [
              { id: "50", label: "💵 $50 USD (1,015 pesos)", emoji: "" },
              { id: "100", label: "💵 $100 USD (2,030 pesos)", emoji: "" },
              { id: "200", label: "💵 $200 USD (4,060 pesos)", emoji: "" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), amountMessage],
        }))
        return true
      }

      if (lowerMessage === "no-change" || lowerMessage === "no" || lowerMessage === "change") {
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_recipient",
            data: {},
            isEditing: prev[contactId]?.isEditing || false,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const updateRecipientCard: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Update beneficiary details",
            subtitle: 'Write it like this: "Full Name, City, State/Province, Country".',
            quote: 'Ex: "Juan Pérez, Guadalajara, JAL, Mexico" | "Ana Silva, Lima, Lima, Peru"',
            options: [{ id: "enter-details", label: "Enter Details", emoji: "✏️" }],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), updateRecipientCard],
        }))
        return true
      }
    }

    if (currentState.step === "awaiting_location_confirmation") {
      const userResponse = userMessage.toLowerCase().trim()

      if (userResponse === "confirm-location" || userResponse === "confirm location" || userResponse === "yes" || userResponse.includes("correct")) {
        // User confirmed the suggested location
        const { recipientName, city, state, country } = currentState.data

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: currentState.isEditing ? "awaiting_completion" : "awaiting_amount",
            data: { recipientName, city, state, country },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        if (currentState.isEditing) {
          // Show updated receipt and action menu
          showTransactionReceipt(contactId, currentState.data)
          return
        }

        // First message: Ask how much
        const questionMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: `Ok, how much do you want to send to ${recipientName}?`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), questionMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        // Second message: Amount options
        const amountMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Choose or type a custom amount",
            subtitle: "",
            options: [
              { id: "50", label: "$50 USD (921 pesos)", emoji: "💵" },
              { id: "100", label: "$100 USD (1,842 pesos)", emoji: "💵" },
              { id: "200", label: "$200 USD (3,684 pesos)", emoji: "💵" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), amountMessage],
        }))
      } else if (userResponse === "enter-different" || userResponse === "enter different" || userResponse === "no") {
        // User wants to enter a different location
        const { recipientName, partialCity } = currentState.data

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_recipient",
            data: { recipientName, city: "", state: "", country: "Mexico" },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const askLocationMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: `No problem! Please provide the full location for ${recipientName}.\n\nFormat: City, State, Country\n\nEx: "Guadalajara, JAL, Mexico"`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), askLocationMessage],
        }))
      }
      return
    }

    if (currentState.step === "awaiting_amount" && /\d+/.test(userMessage)) {
      const amountMatch = userMessage.match(/(\d+(?:\.\d+)?)\s*(MXN|USD|mxn|usd)?/i)
      const amount = amountMatch ? amountMatch[1] : userMessage
      const currency = amountMatch && amountMatch[2] ? amountMatch[2].toUpperCase() : "USD"

      const isPresetAmount = ["50", "100", "200"].includes(amount) && currency === "USD"

      setConversationState((prev) => ({
        ...prev,
        [contactId]: {
          step: "awaiting_method",
          data: { ...prev[contactId].data, amount, currency },
          isEditing: prev[contactId].isEditing,
        },
      }))

      if (currentState.isEditing) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        if (!isPresetAmount) {
          const exchangeRate = 18.42
          const amountNum = Number.parseFloat(amount)
          const convertedAmount =
            currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : (amountNum / exchangeRate).toFixed(2)

          // Format the converted amount with thousand separators
          const formattedConvertedAmount = Number(convertedAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

          const confirmationText =
            currency === "USD"
              ? `Perfect — $${amount} USD = $${formattedConvertedAmount} MXN at today's rate.`
              : `Perfect — $${amount} MXN = $${convertedAmount} USD at today's rate.`

          const confirmMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text: confirmationText,
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            sent: false,
            read: false,
          }

          setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), confirmMessage],
          }))

          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        await showTransactionSummaryAndActions(contactId)
        return true
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      if (!isPresetAmount) {
        const exchangeRate = 18.42
        const amountNum = Number.parseFloat(amount)
        const convertedAmount =
          currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : (amountNum / exchangeRate).toFixed(2)
        const convertedCurrency = currency === "USD" ? "MXN" : "USD"

        // Format the converted amount with thousand separators
        const formattedConvertedAmount = currency === "USD" 
          ? Number(convertedAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
          : convertedAmount

        const confirmationText =
          currency === "USD"
            ? `Perfect — $${amount} USD = $${formattedConvertedAmount} MXN at today's rate.`
            : `Perfect — $${amount} MXN = $${convertedAmount} USD at today's rate.`

        const confirmMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: confirmationText,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), confirmMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)
      }

      // First message: Ask how they want to receive
      const questionMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "How do they want to receive their money?",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), questionMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(false)

      // Second message: Method options
      const methodMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Choose or type a delivery method",
          subtitle: "",
          options: [
            { id: "cash", label: "Cash Pickup", emoji: "💵" },
            { id: "bank", label: "Bank/Card", emoji: "🏦" },
            { id: "wallet", label: "Digital Wallet", emoji: "📱" },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), methodMessage],
      }))
      return true
    }

    if (currentState.step === "awaiting_method") {
      const method = userMessage.toUpperCase()

      if (method.includes("BANK") || method.includes("CARD")) {
        setCurrentFlow("bankCard")
        
        if (currentState.isEditing && currentState.data.clabe) {
          setConversationState((prev) => ({
            ...prev,
            [contactId]: { ...prev[contactId], data: { ...prev[contactId].data, method: "BANK" } },
          }))

          await showTransactionSummaryAndActions(contactId)
          return true
        }

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_clabe_check",
            data: { ...prev[contactId].data, method: "BANK" },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const recipientName = currentState.data.recipientName || "the recipient"
        const firstName = recipientName.split(' ')[0]
        
        const clabeCheckMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: `Do you have ${firstName}'s CLABE or Bank Card number?`,
            subtitle: "",
            options: [
              { id: "clabe-yes", label: "Yes", emoji: "✅" },
              { id: "clabe-no", label: "No / Not sure", emoji: "❌" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), clabeCheckMessage],
        }))
        return true
      } else if (method.includes("CASH")) {
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "confirming",
            data: { ...prev[contactId].data, method: "CASH" },
            isEditing: prev[contactId].isEditing,
          },
        }))

        if (currentState.isEditing) {
          await showTransactionSummaryAndActions(contactId)
          return true
        }

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsTyping(false)

        const data = conversationState[contactId].data
        const confirmationMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          confirmation: {
            title: "✔️ Summary",
            fields: [
              { label: "Amount", value: `${data.amount} ${data.currency}` },
              { label: "Recipient", value: data.recipientName || "" },
              { label: "Location", value: `${data.city}, ${data.state}, ${data.country}` },
              { label: "Method", value: "Cash (OXXO/7-Eleven/Affiliated Network)" },
            ],
            prompt: "Confirm? YES",
            actions: ["Change: AMOUNT / NAME / CITY / METHOD"],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), confirmationMessage],
        }))
        return true
      }
    }

    if (currentState.step === "awaiting_clabe_check") {
      const response = userMessage.toLowerCase()
      const recipientName = currentState.data.recipientName || "the recipient"

      if (response === "yes" || response === "clabe-yes") {
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_clabe",
            data: prev[contactId].data,
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const clabeMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: `Enter ${recipientName}'s CLABE or card number?`,
            subtitle: "",
            quote: "ex: 002910701234567890 (CLABE 18 digits)\nex: 1234567890123456 (Credit or Debit)",
            options: [{ id: "enter-clabe-details", label: "Enter Details", emoji: "✏️" }],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), clabeMessage],
        }))
        return true
      } else if (
        response === "no" ||
        response === "not sure" ||
        response === "clabe-no" ||
        response === "clabe-not-sure"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const infoMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "No problem 👍",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), infoMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        const optionsMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Here are some options for you to try.",
            subtitle: "",
            options: [
              { id: "ask-recipient", label: `Call ${recipientName.split(' ')[0]}`, emoji: "💬" },
              { id: "switch-cash", label: "Switch to Cash Pickup", emoji: "💵" },
              { id: "enter-clabe-inline", label: "Enter CLABE/Card", emoji: "🔢" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), optionsMessage],
        }))
        return true
      } else if (response.includes("clabe") || response.includes("card") || response.includes("enter") || response === "enter-clabe-inline") {
        // User wants to enter the CLABE/Card details
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "awaiting_clabe",
            data: prev[contactId].data,
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        // First message: "Great, you're almost done!"
        const almostDoneMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "Great, you're almost done!",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), almostDoneMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        // Second message: CLABE entry card
        const clabeMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Tap enter details or type the number",
            subtitle: "",
            quote: "ex: 002910701234567890 (CLABE 18 digits)\nex: 1234567890123456 (Credit or Debit)",
            options: [{ id: "enter-clabe-details", label: "Enter Details", emoji: "✏️" }],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), clabeMessage],
        }))
        return true
      } else if (/^\d{18}$/.test(response.replace(/\s/g, ""))) {
        // This block handles direct CLABE input from the 'awaiting_clabe_check' state
        // The logic for processing the CLABE and moving to 'confirming' state is now here
        const accountNumber = response.replace(/\s/g, "")
        const is18Digit = accountNumber.length === 18

        const bankCodes: Record<string, string> = {
          "002": "Banamex",
          "012": "BBVA",
          "014": "Santander",
          "019": "Banjercito",
          "021": "HSBC",
          "030": "Bajío",
          "032": "IXE",
          "036": "Inbursa",
          "037": "Interacciones",
          "042": "Mifel",
          "044": "Scotiabank",
          "058": "BanRegio",
          "059": "Invex",
          "060": "Bansi",
          "062": "Afirme",
          "072": "Banorte",
          "102": "The Royal Bank",
          "103": "American Express",
          "106": "Bank of America",
          "108": "Bank of Tokyo",
          "110": "JP Morgan",
          "112": "Bmonex",
          "113": "Ve Por Mas",
          "116": "ING",
          "124": "Deutsche",
          "126": "Credit Suisse",
          "127": "Azteca",
          "128": "Autofin",
          "130": "Barclays",
          "131": "Compartamos",
          "132": "Banco Famsa",
          "133": "GE Money",
          "134": "Walmart",
          "135": "Nafin",
          "136": "Interbanco",
          "137": "Bancoppel",
          "138": "ABC Capital",
          "139": "UBS Bank",
          "140": "Consubanco",
          "141": "Volkswagen",
          "143": "CIBanco",
          "145": "Bbase",
          "147": "Bankaool",
          "148": "PagaTodo",
          "150": "Inmobiliario",
          "151": "Donde",
          "152": "Bancrea",
          "154": "Banco Finterra",
          "155": "ICBC",
          "156": "Sabadell",
          "157": "Shinhan",
          "158": "Mizuho Bank",
          "159": "Bank of China",
          "160": "Banco S3",
          "166": "BanBajio",
          "168": "Hipotecario Federal",
          "600": "GBM",
          "601": "Monexcb",
          "602": "Masari",
          "605": "Value",
          "606": "Estructuradores",
          "607": "Tiber",
          "608": "Vector",
          "610": "B&B",
          "614": "Accival",
          "616": "Finamex",
          "617": "Valmex",
          "618": "Unica",
          "619": "Mapfre",
          "620": "Profuturo",
          "621": "CB Actinver",
          "622": "Oactin",
          "623": "Skandia",
          "626": "Cbdeutsche",
          "627": "Zurich",
          "628": "Zurichvi",
          "629": "Hipotecaria Su Casita",
          "630": "CB Intercam",
          "631": "CI Bolsa",
          "632": "Bulltick CB",
          "633": "Sterling",
          "634": "Fincomun",
          "636": "HDI Seguros",
          "637": "Order",
          "638": "Akala",
          "640": "JP Morgan CB",
          "642": "Reforma",
          "646": "STP",
          "647": "Telecomm",
          "648": "Evercore",
          "649": "Skandia",
          "651": "Segmty",
          "652": "Asea",
          "653": "Kuspit",
          "655": "Sofiexpress",
          "656": "Unagra",
          "659": "Opciones Empresariales del Noreste",
          "670": "Libertad",
          "901": "CLS",
          "902": "INDEVAL",
        }

        const bankCode = is18Digit ? accountNumber.substring(0, 3) : ""
        const detectedBank = is18Digit ? bankCodes[bankCode] || "Unknown Bank" : "Debit/Credit Card"
        const exchangeRate = Number.parseFloat(currentState.data.exchangeRate || "20.3")
        const amountNum = Number.parseFloat(currentState.data.amount || "0")
        const mxnAmount =
          currentState.data.currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : currentState.data.amount

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "confirming",
            data: {
              ...prev[contactId].data,
              accountNumber,
              deliveryMethod: `${detectedBank} (CLABE ending in ${accountNumber.slice(-4)})`,
            },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const receiptMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          confirmation: {
            title: "📋 Transaction Summary",
            fields: [
              { label: "Recipient", value: currentState.data.recipientName || "" },
              {
                label: "Location",
                value: `${currentState.data.city}, ${currentState.data.state}, ${currentState.data.country}`,
              },
              { label: "Amount to Send", value: `$${currentState.data.amount} ${currentState.data.currency}` },
              { label: "They Receive", value: `$${mxnAmount} MXN` },
              { label: "Exchange Rate", value: `1 USD = ${exchangeRate} MXN` },
              {
                label: "Delivery Method",
                value: `${detectedBank} (CLABE ending in ${accountNumber.slice(-4)})`,
              },
              { label: "Fee", value: "$0.00 (First transfer free!)" },
            ],
            prompt: "Ready to complete your transfer?",
            actions: [],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), receiptMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        const actionMenu: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "What would you like to do?",
            subtitle: "",
            options: [
              { id: "complete-payment", label: "Complete Payment", emoji: "✅" },
              { id: "edit", label: "Edit Transaction", emoji: "✏️" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), actionMenu],
        }))
        return true
      } else if (/^\d{16}$/.test(response.replace(/\s/g, ""))) {
        const accountNumber = response.replace(/\s/g, "")
        const is18Digit = false // 16-digit cards

        const detectedBank = "Debit/Credit Card"
        const exchangeRate = Number.parseFloat(currentState.data.exchangeRate || "20.3")
        const amountNum = Number.parseFloat(currentState.data.amount || "0")
        const mxnAmount =
          currentState.data.currency === "USD" ? (amountNum * exchangeRate).toFixed(2) : currentState.data.amount

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "confirming",
            data: {
              ...prev[contactId].data,
              accountNumber,
              deliveryMethod: `${detectedBank} (Card ending in ${accountNumber.slice(-4)})`,
            },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const receiptMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          confirmation: {
            title: "📋 Transaction Summary",
            fields: [
              { label: "Recipient", value: currentState.data.recipientName || "" },
              {
                label: "Location",
                value: `${currentState.data.city}, ${currentState.data.state}, ${currentState.data.country}`,
              },
              { label: "Amount to Send", value: `$${currentState.data.amount} ${currentState.data.currency}` },
              { label: "They Receive", value: `$${mxnAmount} MXN` },
              { label: "Exchange Rate", value: `1 USD = ${exchangeRate} MXN` },
              {
                label: "Delivery Method",
                value: `${detectedBank} (Card ending in ${accountNumber.slice(-4)})`,
              },
              { label: "Fee", value: "$0.00 (First transfer free!)" },
            ],
            prompt: "Ready to complete your transfer?",
            actions: [],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), receiptMessage],
        }))

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(false)

        const actionMenu: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "What would you like to do?",
            subtitle: "",
            options: [
              { id: "complete-payment", label: "Complete Payment", emoji: "✅" },
              { id: "edit", label: "Edit Transaction", emoji: "✏️" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), actionMenu],
        }))
        return true
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const clabeCard: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          sent: false,
          read: false,
          interactive: {
            title: "Great, you're almost done!",
            subtitle: "Please respond below with the number or tap enter details",
            quote: "ex: 002910701234567890 (CLABE 18 digits)\nex: 1234567890123456 (Credit or Debit)",
            options: [{ id: "enter-clabe-details", label: "✏️ Enter Details", emoji: "" }],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), clabeCard],
        }))
        return true
      }
    }

    // Handlers for new CLABE action menu options
    if (normalizedMessage === "ask-recipient") {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const recipientName = currentState.data.recipientName || "the recipient"
      const helpMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: `Great! You can message ${recipientName} directly on WhatsApp to request their CLABE or card number.\n\nOnce you receive it, just paste it here and we'll continue with your transfer.`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), helpMessage],
      }))
      return true
    }

    if (normalizedMessage === "enter-clabe" || normalizedMessage === "open-clabe-flow") {
      setConversationState((prev) => ({
        ...prev,
        [contactId]: {
          step: "awaiting_clabe",
          data: prev[contactId].data,
          isEditing: prev[contactId].isEditing,
        },
      }))

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const clabeMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Great, you're almost done!",
          subtitle: "Please respond below with the number or tap enter details",
          quote: "ex: 002910701234567890 (CLABE 18 digits)\nex: 1234567890123456 (Credit or Debit)",
          options: [{ id: "enter-clabe-details", label: "Enter Details", emoji: "✏️" }],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), clabeMessage],
      }))
      return true
    }

    if (currentState.step === "awaiting_clabe") {
      const cleanedInput = userMessage.replace(/\s/g, "")

      // Check for 18-digit CLABE
      if (/^\d{18}$/.test(cleanedInput)) {
        const bankCode = cleanedInput.substring(0, 3)
        const bankCodeMap: { [key: string]: string } = {
          "002": "Banamex",
          "012": "BBVA México",
          "014": "Santander",
          "019": "Banjército",
          "021": "HSBC",
          "030": "Bajío",
          "032": "IXE",
          "036": "Inbursa",
          "037": "Interacciones",
          "042": "Mifel",
          "044": "Scotiabank",
          "058": "Banregio",
          "059": "Invex",
          "060": "Bansi",
          "062": "Afirme",
          "072": "Banorte",
          "102": "The Royal Bank",
          "103": "American Express",
          "106": "Bank of America",
          "108": "Bank of Tokyo",
          "110": "JP Morgan",
          "112": "Bmonex",
          "113": "Ve Por Mas",
          "116": "ING",
          "124": "Deutsche",
          "126": "Credit Suisse",
          "127": "Azteca",
          "128": "Autofin",
          "130": "Barclays",
          "131": "Famsa",
          "132": "BMULTIVA",
          "133": "Actinver",
          "134": "Wal-Mart",
          "135": "Nafin",
          "136": "Intercam",
          "137": "Bancoppel",
          "138": "ABC Capital",
          "139": "UBS Bank",
          "140": "Consubanco",
          "141": "Volkswagen",
          "143": "CIBanco",
          "145": "Bbase",
          "147": "Bankaool",
          "148": "PagaTodo",
          "150": "Inmobiliario",
          "151": "Donde",
          "152": "Bancrea",
          "154": "Banco Finterra",
          "155": "ICBC",
          "156": "Sabadell",
          "157": "Shinhan",
          "158": "Mizuho Bank",
          "159": "Bank of China",
          "160": "Banco S3",
          "166": "BanBajio",
          "168": "AsEa",
          "600": "GBM",
          "601": "Monexcb",
          "602": "Masari",
          "605": "Value",
          "606": "Estructuradores",
          "607": "Tiber",
          "608": "Vector",
          "610": "B&B",
          "614": "Accival",
          "616": "Finamex",
          "617": "Valmex",
          "618": "Unica",
          "619": "MAPFRE",
          "620": "Profuturo",
          "621": "CB Actinver",
          "622": "Oactin",
          "623": "Skandia",
          "626": "Cbdeutsche",
          "627": "Zurich",
          "628": "Zurichvi",
          "629": "SU Casas",
          "630": "CB Intercam",
          "631": "CI Bolsa",
          "632": "Bulltick CB",
          "633": "Sterling",
          "634": "Fincomun",
          "636": "HDI Seguros",
          "637": "Order",
          "638": "Akala",
          "640": "JP Morgan CB",
          "642": "Reforma",
          "646": "STP",
          "647": "Telecomm",
          "648": "Evercore",
          "649": "Skandia",
          "651": "Segmty",
          "652": "Asea",
          "653": "Kuspit",
          "655": "Sofiexpress",
          "656": "Unagra",
          "659": "Opciones Empresariales del Noreste",
          "670": "Libertad",
          "901": "CLS",
          "902": "INDEVAL",
        }
        const bankName = bankCodeMap[bankCode] || "Bank"

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "confirming",
            data: { ...prev[contactId].data, clabe: cleanedInput, bankName },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await showTransactionSummaryAndActions(contactId)
        return true
      }

      // Check for 16-digit card number
      if (/^\d{16}$/.test(cleanedInput)) {
        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "confirming",
            data: { ...prev[contactId].data, clabe: cleanedInput, bankName: "Debit/Credit Card" },
            isEditing: prev[contactId].isEditing,
          },
        }))

        await showTransactionSummaryAndActions(contactId)
        return true
      }
    }

    // Handle the 'awaiting_save_recipient' step
    if (currentState.step === "awaiting_save_recipient") {
      const nickname = userMessage.toLowerCase().trim() // Use userMessage, not lowerMessage
      if (nickname) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        // Add confirmation message
        const confirmationMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "Got it!",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          sent: false,
          read: false,
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), confirmationMessage],
        }))

        // Add follow-up card with specific amount
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const followUpMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          sent: false,
          read: false,
          interactive: {
            title: "➡️ Next time just type:",
            subtitle: "",
            quote: `"Send ${nickname} $${currentState.data.amount || '150'}"`,
            options: [],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), followUpMessage],
        }))

        // Add referral follow-up message
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsTyping(false)

        const referralMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: "",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          sent: false,
          read: false,
          interactive: {
            title: "Did you know?  You can earn money and better exchange rates by referring others to Félix.",
            subtitle: "",
            options: [
              { id: "refer-progress", label: "Progress: ⬜ ⬜ ⬜ ⬜ ⬜", emoji: "" },
              { id: "refer-friend", label: "Refer friend", emoji: "✏️" },
            ],
          },
        }

        setMessages((prev) => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), referralMessage],
        }))

        // Mark prototype as complete
        setPrototypeComplete(true)

        setConversationState((prev) => ({
          ...prev,
          [contactId]: {
            step: "idle",
            data: {},
          },
        }))

        return
      }
    }

    // Default response for unhandled input
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    const unknownMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: "Sorry, I didn't understand that. Please try again or type 'Help'.",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), unknownMessage],
    }))
    return true
  }

  const handleMenuOptionClick = async (optionId: string, contactId: string) => {
    if (optionId === "compare") {
      setShowCompareModal(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: optionId === "send" ? "Send Money" : "How Félix works",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: true,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMessage],
    }))

    if (optionId === "send") {
      setCurrentFlow("sendMoney")
      setConversationState((prev) => ({
        ...prev,
        [contactId]: { step: "awaiting_recipient", data: {} },
      }))

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      // First message: "OK, great. Let's get you started."
      const introMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "OK, great. Let's get you started.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), introMessage],
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      const botMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        interactive: {
          title: "Who do you want to send money to?",
          subtitle: "",
          quote: 'Example: "Juan Pérez, Guadalajara, JAL, Mexico" | "Ana Silva, Lima, Lima, Peru"',
          options: [
            {
              id: "enter-details",
              label: "Enter Details",
              emoji: "✏️",
            },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), botMessage],
      }))
    } else if (optionId === "how") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsTyping(false)

      const carouselMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text: "",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sent: false,
        read: false,
        carousel: {
          cards: [
            {
              image: "/person-sending-money-on-phone.jpg",
              title: "1. Tell us who & how much",
              description: "Just type naturally: 'Send $200 to Maria in Mexico City'",
            },
            {
              image: "/people-sharing-money-and-earning-rewards-referral-.jpg",
              title: "Refer friends, earn rewards",
              description: "Give $10, get $10. Share Félix with friends and both get credit on your next transfer",
            },
            {
              image: "/happy-person-receiving-money.jpg",
              title: "3. They get it fast",
              description: "Cash pickup in 15-30 min or bank transfer in hours",
            },
          ],
        },
      }

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), carouselMessage],
      }))
    }
  }

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: true,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }))

    // Track that user has sent a message
    setUserHasSentMessage(true)

    // Reset inactivity timer on user activity
    startInactivityTimer(selectedContact.id)

    if (selectedContact.id === "1" && !hasReceivedFirstMessage["1"]) {
      setHasReceivedFirstMessage((prev) => ({ ...prev, "1": true }))
      sendBotResponses(selectedContact.id)
    } else if (selectedContact.id === "1") {
      await handleRemittanceFlow(selectedContact.id, text)
    }
  }

  const handleRecipientFlowSubmit = (data: {
    firstName: string
    lastName: string
    city: string
    state: string
    country: string
  }) => {
    const fullName = `${data.firstName} ${data.lastName}`
    const formattedInput = `${fullName}, ${data.city}, ${data.state}, ${data.country}`
    setShowRecipientFlowPanel(false)
    handleSendMessage(formattedInput)
  }

  const handleClabeFlowSubmit = (accountNumber: string) => {
    setShowClabeFlowPanel(false)
    handleSendMessage(accountNumber)
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "OPEN_RECIPIENT_FLOW") {
        setShowRecipientFlowPanel(true)
      }
      if (event.data.type === "OPEN_CLABE_FLOW") {
        setShowClabeFlowPanel(true)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Start inactivity timer when contact changes
  useEffect(() => {
    if (selectedContact.id === "1") {
      startInactivityTimer(selectedContact.id)
    }
  }, [selectedContact.id])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
    }
  }, [inactivityTimer])

  const handleRecipientFlowSubmitFromPanel = async (data: {
    firstName: string
    lastName: string
    city: string
    state: string
    country: string
  }) => {
    if (!recipientFlowContactId) return

    const fullName = `${data.firstName} ${data.lastName}`
    const contactId = recipientFlowContactId

    // Close the flow panel
    setShowRecipientFlowPanel(false)
    setRecipientFlowContactId(null)

    // Send user message showing what they entered
    const userMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: `${fullName}, ${data.city}, ${data.state}, ${data.country}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: true,
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMessage],
    }))

    // Update conversation state with recipient data
    setConversationState((prev) => ({
      ...prev,
      [contactId]: {
        step: "awaiting_recipient_confirmation",
        data: {
          recipientName: fullName,
          city: data.city,
          state: data.state,
          country: data.country,
        },
        isEditing: prev[contactId]?.isEditing || false,
      },
    }))

    // Show confirmation card
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    const confirmMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sent: false,
      read: false,
      interactive: {
        title: "Confirm Recipient",
        subtitle: `Is this correct? ${fullName}, ${data.city}, ${data.state}, ${data.country}`,
        options: [
          { id: "yes-correct", label: "Yes, Correct", emoji: "✅" },
          { id: "no-change", label: "No, Change", emoji: "❌" },
        ],
      },
    }

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), confirmMessage],
    }))
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 gap-16">
      {/* Slide Content */}
      <div className="flex-1 max-w-2xl">
        {/* Slide 0: Cover */}
        {currentSlide === 0 && (
          <div className="animate-in fade-in duration-500">
            <div className="border-l-4 border-cyan-500 pl-8 mb-16">
              <p className="text-sm font-medium text-cyan-600 tracking-[0.2em] uppercase mb-6">Félix Pago</p>
              <h1 className="text-6xl font-light text-gray-900 leading-tight mb-4">
                Chat UX
              </h1>
              <h1 className="text-6xl font-light text-gray-900 leading-tight mb-8">
                <span className="font-normal">Directional Concept</span>
              </h1>
              <p className="text-base font-light text-gray-600 leading-relaxed">
                <span className="font-medium">Purpose:</span> Explore and validate scalable UX patterns and guidelines for the Félix chat experience
              </p>
            </div>

            <button
              onClick={() => setCurrentSlide(1)}
              className="px-12 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-cyan-600 transition-colors cursor-pointer"
            >
              Start
            </button>
          </div>
        )}

        {/* Slide 1: Purpose */}
        {currentSlide === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="border-l-4 border-cyan-500 pl-8 mb-12">
              <p className="text-sm font-medium text-cyan-600 tracking-[0.2em] uppercase mb-2">01</p>
              <h1 className="text-5xl font-light text-gray-900 leading-tight">
                Purpose of This<br />Prototype
              </h1>
            </div>
            
            <div className="space-y-8 mb-16">
              <p className="text-xl font-light text-gray-800 leading-relaxed">
                To explore and validate directional UX concepts that inform <span className="font-bold">durable guidelines</span> for <span className="font-bold">clarity</span>, <span className="font-bold">consistency</span>, and <span className="font-bold">scalability</span> across the Félix experience.
              </p>

              <div className="border-l-2 border-gray-300 pl-6">
                <p className="text-base font-medium text-gray-900 mb-4">
                  This work is intentionally exploratory, not prescriptive. It is designed to:
                </p>

                <ul className="space-y-3 text-base text-gray-700">
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Test UX hypotheses against real product problems</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Align design exploration with roadmap priorities</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Identify patterns that can inform system-level UX guidelines</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Surface UX principles that can guide a long-term north star</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Enable productive discussion and iteration before committing to solutions</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setCurrentSlide(2)}
              className="px-12 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-cyan-600 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Slide 2: From Exploration to UX Guidelines */}
        {currentSlide === 2 && (
          <div className="animate-in fade-in duration-500">
            <div className="border-l-4 border-cyan-500 pl-8 mb-12">
              <p className="text-sm font-medium text-cyan-600 tracking-[0.2em] uppercase mb-2">02</p>
              <h1 className="text-5xl font-light text-gray-900 leading-tight">
                From Exploration to<br />UX Guidelines
              </h1>
            </div>
            
            <div className="space-y-8 mb-16">
              <p className="text-xl font-light text-gray-800 leading-relaxed">
                UX guidelines turn exploration into scale.
              </p>

              <p className="text-base font-light text-gray-700 leading-relaxed">
                They codify proven patterns, reduce rework, and allow teams to ship faster—without sacrificing quality or consistency.
              </p>

              <div className="border-l-2 border-gray-300 pl-6">
                <p className="text-base font-medium text-gray-900 mb-4">
                  This prototype is an input to the UX guidelines, not an output. It helps us:
                </p>

                <ul className="space-y-3 text-base text-gray-700">
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Validate which patterns actually improve clarity and speed</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Identify where structure is required vs. where flexibility is allowed</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Extract reusable interaction, copy, and flow rules</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Pressure-test principles against real constraints (WhatsApp, compliance, edge cases)</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-2 border-cyan-500 pl-6 py-4 bg-gray-50">
                <p className="text-base font-medium text-gray-900 leading-relaxed">
                  The goal is not this exact UI.<br />
                  The goal is durable guidance teams can apply repeatedly across the product.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentSlide(3)}
              className="px-12 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-cyan-600 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Slide 3: Guiding UX Principles */}
        {currentSlide === 3 && (
          <div className="animate-in fade-in duration-500">
            <div className="border-l-4 border-cyan-500 pl-8 mb-8">
              <p className="text-sm font-medium text-cyan-600 tracking-[0.2em] uppercase mb-2">03</p>
              <h1 className="text-5xl font-light text-gray-900 leading-tight">
                Guiding UX Principles
              </h1>
            </div>
            
            <div className="space-y-10">
              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Conversational Transactions, Not Transactional Experiences
                </h2>
                <p className="text-base font-light text-gray-600">
                  Warm, human, and respectful conversational UX, not a mechanical one.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Guide Initial Transfers. Accelerate the Next Ones.
                </h2>
                <p className="text-base font-light text-gray-600">
                  Learning first for new users, speed for returning ones.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Reveal What's Possible, When It's Useful
                </h2>
                <p className="text-base font-light text-gray-600">
                  Surface capabilities in context—teaching through use, not promotion.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Taps First. Type When You Want.
                </h2>
                <p className="text-base font-light text-gray-600">
                  Structured for speed and accuracy, open to natural language.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Always Help Move the User Forward
                </h2>
                <p className="text-base font-light text-gray-600">
                  No dead ends. Every interaction should offer a clear next step.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Catch Errors Before They Happen
                </h2>
                <p className="text-base font-light text-gray-600">
                  Validate early. Confirm only when it matters most.
                </p>
              </div>

              <div className={
                prototypeComplete
                  ? "transition-opacity duration-500 border-l-2 border-gray-200 pl-6"
                  : currentFlow === "bankCard"
                  ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6"
                  : currentFlow === "sendMoney" 
                    ? "transition-opacity duration-500 border-l-2 border-cyan-500 pl-6" 
                    : userHasSentMessage 
                      ? "transition-opacity duration-500 opacity-30 border-l-2 border-gray-200 pl-6" 
                      : "transition-opacity duration-500 opacity-100 border-l-2 border-gray-200 pl-6"
              }>
                <h2 className="text-xl font-medium text-gray-900 mb-1">
                  Structured Without Showing the Structure
                </h2>
                <p className="text-base font-light text-gray-600">
                  Capture clean, reliable inputs without breaking conversational flow.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl flex-shrink-0">
        {/* Phone Screen */}
        <div className="w-full h-full bg-[#0a1014] rounded-[32px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-sm z-50">
            <div className="flex justify-between items-center px-6 pt-1 text-white text-xs">
              <span className="font-semibold">{formatTime(currentTime)}</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-white rounded-sm">
                  <div className="w-3 h-full bg-green-500 rounded-sm"></div>
                </div>
                <span className="text-xs">100%</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Interface */}
          <div className="flex h-full bg-[#0a1014] pt-6">
            {isSidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
            )}

            <div
              className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm transition-transform duration-300`}
            >
              <ChatSidebar
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={(contact) => {
                  setSelectedContact(contact)
                  setIsSidebarOpen(false)
                }}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>

            <div className="flex-1">
              <ChatWindow
                contact={selectedContact}
                messages={messages[selectedContact.id] || []}
                onSendMessage={handleSendMessage}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                initialInputValue={initialInputValues[selectedContact.id] || ""}
                isTyping={isTyping}
                onMenuOptionClick={(optionId) => handleMenuOptionClick(optionId, selectedContact.id)}
                onTrackDetailsClick={() => setShowTrackDetailsModal(true)}
              />
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>

        {/* Modals - Inside Phone Frame */}
        <CompareRatesModal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} />

        {showRecipientFlowPanel && (
          <RecipientFlowPanel
            onSubmit={handleRecipientFlowSubmitFromPanel}
            onClose={() => setShowRecipientFlowPanel(false)}
          />
        )}

        {showClabeFlowPanel && (
          <ClabeFlowPanel
            onSubmit={handleClabeFlowSubmit}
            onClose={() => setShowClabeFlowPanel(false)}
            recipientName={conversationState[activeContact]?.data?.recipientName}
          />
        )}

        {/* Track Details Modal */}
        {showTrackDetailsModal && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white rounded-t-2xl w-full h-[70vh] overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recipient information
                  </h3>
                  <button
                    onClick={() => setShowTrackDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={trackDetailsForm.firstName}
                      onChange={(e) => setTrackDetailsForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={trackDetailsForm.lastName}
                      onChange={(e) => setTrackDetailsForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={trackDetailsForm.city}
                      onChange={(e) => setTrackDetailsForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      value={trackDetailsForm.state}
                      onChange={(e) => setTrackDetailsForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    >
                      <option value="Select">Select</option>
                      <option value="Aguascalientes">Aguascalientes</option>
                      <option value="Baja California">Baja California</option>
                      <option value="Baja California Sur">Baja California Sur</option>
                      <option value="Campeche">Campeche</option>
                      <option value="Chiapas">Chiapas</option>
                      <option value="Chihuahua">Chihuahua</option>
                      <option value="Ciudad de México">Ciudad de México</option>
                      <option value="Coahuila">Coahuila</option>
                      <option value="Colima">Colima</option>
                      <option value="Durango">Durango</option>
                      <option value="Guanajuato">Guanajuato</option>
                      <option value="Guerrero">Guerrero</option>
                      <option value="Hidalgo">Hidalgo</option>
                      <option value="Jalisco">Jalisco</option>
                      <option value="México">México</option>
                      <option value="Michoacán">Michoacán</option>
                      <option value="Morelos">Morelos</option>
                      <option value="Nayarit">Nayarit</option>
                      <option value="Nuevo León">Nuevo León</option>
                      <option value="Oaxaca">Oaxaca</option>
                      <option value="Puebla">Puebla</option>
                      <option value="Querétaro">Querétaro</option>
                      <option value="Quintana Roo">Quintana Roo</option>
                      <option value="San Luis Potosí">San Luis Potosí</option>
                      <option value="Sinaloa">Sinaloa</option>
                      <option value="Sonora">Sonora</option>
                      <option value="Tabasco">Tabasco</option>
                      <option value="Tamaulipas">Tamaulipas</option>
                      <option value="Tlaxcala">Tlaxcala</option>
                      <option value="Veracruz">Veracruz</option>
                      <option value="Yucatán">Yucatán</option>
                      <option value="Zacatecas">Zacatecas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={trackDetailsForm.country}
                      onChange={(e) => setTrackDetailsForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    >
                      <option value="Mexico">Mexico</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => handleTrackDetailsSubmit(activeContact)}
                  className="w-full bg-[#25D366] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1ea952] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
