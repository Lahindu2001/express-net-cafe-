import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    if (body.role) {
      await sql`
        UPDATE users SET role = ${body.role} WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    // Delete user sessions first
    await sql`DELETE FROM sessions WHERE user_id = ${id}`
    // Delete user reviews
    await sql`DELETE FROM reviews WHERE user_id = ${id}`
    // Delete user
    await sql`DELETE FROM users WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
