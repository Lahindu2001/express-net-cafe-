import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

// Send message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, message, senderType } = body

    if (!sessionId || !message || !senderType) {
      return NextResponse.json(
        { error: "Session ID, message, and sender type required" },
        { status: 400 }
      )
    }

    const session = await getSession()
    
    // Insert message
    const result = await sql`
      INSERT INTO chat_messages (session_id, sender_type, sender_id, message, is_read)
      VALUES (
        ${sessionId}, 
        ${senderType}, 
        ${session?.userId || null}, 
        ${message},
        ${senderType === 'admin'}
      )
      RETURNING *
    `

    // Update session last_message_at
    await sql`
      UPDATE chat_sessions 
      SET last_message_at = CURRENT_TIMESTAMP 
      WHERE id = ${sessionId}
    `

    return NextResponse.json({ message: result[0] })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// Get messages for a session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const messages = await sql`
      SELECT 
        cm.*,
        u.name as sender_name
      FROM chat_messages cm
      LEFT JOIN users u ON cm.sender_id = u.id
      WHERE cm.session_id = ${sessionId}
      ORDER BY cm.created_at ASC
    `

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// Mark messages as read
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    await sql`
      UPDATE chat_messages 
      SET is_read = true 
      WHERE session_id = ${sessionId} AND sender_type = 'customer'
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    )
  }
}
