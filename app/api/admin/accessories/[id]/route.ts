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
    
    if (body.name !== undefined) {
      updates.push('name')
      values.push(body.name)
    }
    
    if (body.description !== undefined) {
      updates.push('description')
      values.push(body.description)
    }
    
    if (body.price !== undefined) {
      updates.push('price')
      values.push(body.price)
    }
    
    if (body.quantity !== undefined) {
      updates.push('quantity')
      values.push(body.quantity)
    }
    
    if (body.image_url !== undefined) {
      updates.push('image_url')
      values.push(body.image_url)
    }
    
    if (body.compatible_models !== undefined) {
      updates.push('compatible_models')
      values.push(body.compatible_models)
    }

    if (updates.length > 0) {
      // Build dynamic update using template literals like the DELETE method
      const updateFields = []
      
      if (body.name !== undefined) {
        updateFields.push(sql`name = ${body.name}`)
      }
      if (body.description !== undefined) {
        updateFields.push(sql`description = ${body.description}`)
      }
      if (body.price !== undefined) {
        updateFields.push(sql`price = ${body.price}`)
      }
      if (body.quantity !== undefined) {
        updateFields.push(sql`quantity = ${body.quantity}`)
      }
      if (body.image_url !== undefined) {
        updateFields.push(sql`image_url = ${body.image_url}`)
      }
      if (body.compatible_models !== undefined) {
        updateFields.push(sql`compatible_models = ${body.compatible_models}`)
      }
      
      await sql`
        UPDATE accessories 
        SET ${sql.join(updateFields, sql`, `)}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating accessory:", error)
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
    await sql`DELETE FROM accessories WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting accessory:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
