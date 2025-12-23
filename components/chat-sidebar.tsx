"use client"

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

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
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

const MessageSquareIcon = () => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const XIcon = () => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Contact } from "./whatsapp-chat"

interface ChatSidebarProps {
  contacts: Contact[]
  selectedContact: Contact
  onSelectContact: (contact: Contact) => void
  onClose: () => void
}

export function ChatSidebar({ contacts, selectedContact, onSelectContact, onClose }: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar-bg">
      {/* Header */}
      <div className="flex items-center justify-between bg-header-bg p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/abstract-geometric-shapes.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold text-white">Chats</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
            <XIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <MessageSquareIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <MoreVerticalIcon />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border-b p-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SearchIcon />
          </div>
          <Input placeholder="Search or start new chat" className="pl-10 h-11 bg-background border-none" />
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`flex w-full items-center gap-3 border-b p-4 min-h-[72px] transition-colors hover:bg-muted/50 active:bg-muted ${
              selectedContact.id === contact.id ? "bg-muted" : ""
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar-bg bg-primary" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                  {contact.verified && <VerifiedIcon />}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{contact.timestamp}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm text-muted-foreground">{contact.lastMessage}</p>
                {contact.unread && (
                  <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  )
}
