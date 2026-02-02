import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock } from "lucide-react"
import { ChatList } from "@/components/admin/chat-list"

async function getChatStats() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
        SUM((SELECT COUNT(*) FROM chat_messages cm WHERE cm.session_id = cs.id AND sender_type = 'customer' AND is_read = false)) as unread_messages
      FROM chat_sessions cs
    `
    return stats[0]
  } catch (error) {
    console.error("Error fetching chat stats:", error)
    return { total_sessions: 0, active_sessions: 0, unread_messages: 0 }
  }
}

export default async function AdminChatsPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const stats = await getChatStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Chats</h1>
        <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sessions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_sessions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unread_messages || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chat List */}
      <ChatList />
    </div>
  )
}
