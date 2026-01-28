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

    // Handle updates individually to avoid sql.unsafe issues  
    if (body.display_type !== undefined) {
      await sql`UPDATE display_prices SET display_type = ${body.display_type}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.price !== undefined) {
      await sql`UPDATE display_prices SET price = ${body.price}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.notes !== undefined) {
      await sql`UPDATE display_prices SET notes = ${body.notes}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating display price:", error)
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
    await sql`DELETE FROM display_prices WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting display price:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
