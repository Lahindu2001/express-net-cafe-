import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

// Get or create chat session
export async function POST(request: Request) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { guestName, guestEmail } = body

    let chatSession

    if (session?.userId) {
      // Check if user already has an active session
      const existing = await sql`
        SELECT * FROM chat_sessions 
        WHERE user_id = ${session.userId} AND status = 'active'
        ORDER BY last_message_at DESC
        LIMIT 1
      `
      
      if (existing.length > 0) {
        chatSession = existing[0]
      } else {
        // Create new session for logged-in user
        const result = await sql`
          INSERT INTO chat_sessions (user_id, status)
          VALUES (${session.userId}, 'active')
          RETURNING *
        `
        chatSession = result[0]
      }
    } else {
      // Guest user - create new session
      if (!guestName || !guestEmail) {
        return NextResponse.json(
          { error: "Guest name and email required" },
          { status: 400 }
        )
      }

      const result = await sql`
        INSERT INTO chat_sessions (guest_name, guest_email, status)
        VALUES (${guestName}, ${guestEmail}, 'active')
        RETURNING *
      `
      chatSession = result[0]
    }

    return NextResponse.json({ session: chatSession })
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    )
  }
}

// Get chat session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const result = await sql`
      SELECT * FROM chat_sessions WHERE id = ${sessionId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ session: result[0] })
  } catch (error) {
    console.error("Error fetching chat session:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat session" },
      { status: 500 }
    )
  }
}

// Delete chat session
export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Delete associated messages first
    await sql`
      DELETE FROM chat_messages WHERE session_id = ${sessionId}
    `

    // Delete the session
    await sql`
      DELETE FROM chat_sessions WHERE id = ${sessionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return NextResponse.json(
      { error: "Failed to delete chat session" },
      { status: 500 }
    )
  }
}
