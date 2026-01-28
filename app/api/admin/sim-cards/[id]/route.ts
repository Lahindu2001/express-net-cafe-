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
    if (body.type !== undefined) {
      await sql`UPDATE sim_cards SET type = ${body.type}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.price !== undefined) {
      await sql`UPDATE sim_cards SET price = ${body.price}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.quantity !== undefined) {
      await sql`UPDATE sim_cards SET quantity = ${body.quantity}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.description !== undefined) {
      await sql`UPDATE sim_cards SET description = ${body.description}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating SIM card:", error)
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
    await sql`DELETE FROM sim_cards WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting SIM card:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
