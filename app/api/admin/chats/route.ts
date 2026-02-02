import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

// Get all chat sessions (admin only)
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await sql`
      SELECT 
        cs.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM chat_messages 
         WHERE session_id = cs.id AND sender_type = 'customer' AND is_read = false) as unread_count,
        (SELECT message FROM chat_messages 
         WHERE session_id = cs.id 
         ORDER BY created_at DESC LIMIT 1) as last_message
      FROM chat_sessions cs
      LEFT JOIN users u ON cs.user_id = u.id
      ORDER BY cs.last_message_at DESC
    `

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    )
  }
}
