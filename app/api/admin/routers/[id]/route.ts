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

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    const allowedFields = ['model', 'price', 'quantity', 'description', 'features', 'image_url']
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`)
        values.push(body[field])
        paramIndex++
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    const query = `UPDATE routers SET ${updates.join(', ')} WHERE id = $${paramIndex}`
    
    await sql.unsafe(query, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating router:", error)
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
    await sql`DELETE FROM routers WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting router:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
