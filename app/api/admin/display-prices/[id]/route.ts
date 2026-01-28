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

    // Build update query dynamically based on provided fields
    const updates = []
    const values = []
    
    if (body.display_type !== undefined) {
      updates.push('display_type')
      values.push(body.display_type)
    }
    
    if (body.price !== undefined) {
      updates.push('price')
      values.push(body.price)
    }
    
    if (body.quantity !== undefined) {
      updates.push('quantity')
      values.push(body.quantity)
    }
    
    if (body.notes !== undefined) {
      updates.push('notes')
      values.push(body.notes)
    }

    if (updates.length > 0) {
      const setClause = updates.map((field, index) => `${field} = $${index + 1}`).join(', ')
      await sql.unsafe(`UPDATE display_prices SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1}`, [...values, id])
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
