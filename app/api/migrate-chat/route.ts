import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      )
    }

    // Run migration to update timestamp columns to TIMESTAMPTZ
    await sql`
      ALTER TABLE chat_sessions 
        ALTER COLUMN last_message_at TYPE TIMESTAMPTZ USING last_message_at AT TIME ZONE 'UTC'
    `
    
    await sql`
      ALTER TABLE chat_sessions 
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'
    `

    await sql`
      ALTER TABLE chat_messages 
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'
    `

    // Verify the changes
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('chat_sessions', 'chat_messages') 
        AND column_name LIKE '%_at'
      ORDER BY table_name, column_name
    `

    return NextResponse.json({ 
      success: true, 
      message: "Migration completed successfully",
      columns: result
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    
    // If column already has the correct type, it's okay
    if (error.message?.includes("already exists") || error.message?.includes("timestamp with time zone")) {
      return NextResponse.json({ 
        success: true, 
        message: "Tables already migrated or migration not needed"
      })
    }
    
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    )
  }
}
