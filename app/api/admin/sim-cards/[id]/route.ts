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
    
    if (body.type !== undefined) {
      updates.push('type')
      values.push(body.type)
    }
    
    if (body.price !== undefined) {
      updates.push('price')
      values.push(body.price)
    }
    
    if (body.quantity !== undefined) {
      updates.push('quantity')
      values.push(body.quantity)
    }
    
    if (body.description !== undefined) {
      updates.push('description')
      values.push(body.description)
    }

    if (updates.length > 0) {
      const setClause = updates.map((field, index) => `${field} = $${index + 1}`).join(', ')
      await sql.unsafe(`UPDATE sim_cards SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1}`, [...values, id])
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
