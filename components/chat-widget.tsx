"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Message {
  id: number
  sender_type: "customer" | "admin"
  message: string
  created_at: string
  sender_name?: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" })
  const [needsGuestInfo, setNeedsGuestInfo] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Poll for new messages
  useEffect(() => {
    if (isOpen && sessionId) {
      fetchMessages()
      pollIntervalRef.current = setInterval(fetchMessages, 5000) // Poll every 5 seconds (reduced frequency)
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [isOpen, sessionId])

  const initializeChat = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestInfo),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 400 && data.error.includes("required")) {
          setNeedsGuestInfo(true)
          return
        }
        throw new Error("Failed to create session")
      }

      const data = await response.json()
      setSessionId(data.session.id)
      setNeedsGuestInfo(false)
      await fetchMessages(data.session.id)
    } catch (error) {
      console.error("Error initializing chat:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sid?: number) => {
    const id = sid || sessionId
    if (!id) return

    try {
      const response = await fetch(`/api/chat/messages?sessionId=${id}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      // Don't retry on network errors to avoid triggering permission dialogs
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId) return

    setSending(true)
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: message.trim(),
          senderType: "customer",
        }),
      })

      if (response.ok) {
        setMessage("")
        await fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleOpenChat = () => {
    setIsOpen(true)
    if (!sessionId && !needsGuestInfo) {
      initializeChat()
    }
  }

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (guestInfo.name && guestInfo.email) {
      initializeChat()
    }
  }

  return (
    <>
      {/* Chat Box */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-w-[360px] shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg pb-3 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Express Net Cafe"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-sm">Express Net Cafe</CardTitle>
                  <p className="text-xs opacity-90">We'll reply ASAP</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20 h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : needsGuestInfo ? (
              <form onSubmit={handleGuestSubmit} className="p-4 space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-2">Welcome! 👋</h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide your details to start chatting
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Name *</Label>
                  <Input
                    id="guest-name"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-email">Email *</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Start Chat
                </Button>
              </form>
            ) : (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          No messages yet. Say hi! 👋
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender_type === "customer"
                              ? "bg-primary text-primary-foreground"
                              : "bg-white dark:bg-gray-800 border border-border"
                          }`}
                        >
                          {msg.sender_type === "admin" && (
                            <p className="text-xs font-semibold mb-1 opacity-70">
                              {msg.sender_name || "Support"}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          {mounted && (
                            <p className={`text-xs mt-1 ${msg.sender_type === "customer" ? "opacity-80" : "opacity-50"}`}>
                              {new Date(msg.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t border-border bg-white dark:bg-card">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      rows={2}
                      className="resize-none flex-1"
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                      size="icon"
                      className="self-end"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 sm:h-7 sm:w-7" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-6 right-20 sm:right-24 bg-white dark:bg-gray-800 text-foreground px-4 py-2 rounded-lg shadow-lg z-40 animate-in slide-in-from-right-5 duration-300 hidden sm:block">
          <p className="text-sm font-medium">Need help? Chat with us!</p>
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white dark:border-l-gray-800"></div>
        </div>
      )}
    </>
  )
}
