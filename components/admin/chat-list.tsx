"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, Loader2, User, MessageCircle, RefreshCw, Trash2 } from "lucide-react"

interface ChatSession {
  id: number
  user_name?: string
  user_email?: string
  guest_name?: string
  guest_email?: string
  status: string
  unread_count: number
  last_message?: string
  last_message_at: string
}

interface Message {
  id: number
  sender_type: "customer" | "admin"
  message: string
  created_at: string
  sender_name?: string
}

export function ChatList() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id)
      pollIntervalRef.current = setInterval(() => fetchMessages(selectedSession.id), 3000)
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [selectedSession])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/admin/chats")
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        
        // Mark messages as read
        await fetch("/api/chat/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return

    setSending(true)
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          message: newMessage.trim(),
          senderType: "admin",
        }),
      })

      if (response.ok) {
        setNewMessage("")
        await fetchMessages(selectedSession.id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this chat session? This will permanently delete all messages.")) {
      return
    }

    try {
      const response = await fetch(`/api/chat/session?sessionId=${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Clear selected session if it was deleted
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null)
          setMessages([])
        }
        // Refresh the sessions list
        await fetchSessions()
      }
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  const getDisplayName = (session: ChatSession) => {
    return session.user_name || session.guest_name || "Guest User"
  }

  const getDisplayEmail = (session: ChatSession) => {
    return session.user_email || session.guest_email || "No email"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
      {/* Sessions List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Button variant="ghost" size="icon" onClick={fetchSessions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-[calc(100vh-400px)] overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative hover:bg-muted transition-colors ${
                    selectedSession?.id === session.id ? "bg-muted" : ""
                  }`}
                >
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm">{getDisplayName(session)}</p>
                      {session.unread_count > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {session.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{getDisplayEmail(session)}</p>
                    {session.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {session.last_message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(session.last_message_at).toLocaleString()}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSession(session.id)
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedSession ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{getDisplayName(selectedSession)}</CardTitle>
                  <p className="text-sm text-muted-foreground">{getDisplayEmail(selectedSession)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col" style={{ height: "calc(100% - 80px)" }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender_type === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white dark:bg-gray-800 border border-border"
                      }`}
                    >
                      {msg.sender_type === "admin" && (
                        <p className="text-xs font-semibold mb-1 opacity-70">You</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender_type === "admin" ? "opacity-80" : "opacity-50"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-white dark:bg-card">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
                    disabled={!newMessage.trim() || sending}
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
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
