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
    if (body.name !== undefined) {
      await sql`UPDATE services SET name = ${body.name}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.description !== undefined) {
      await sql`UPDATE services SET description = ${body.description}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.price !== undefined) {
      await sql`UPDATE services SET price = ${body.price}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.price_unit !== undefined) {
      await sql`UPDATE services SET price_unit = ${body.price_unit}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (body.icon !== undefined) {
      await sql`UPDATE services SET icon = ${body.icon}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
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
    await sql`DELETE FROM services WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
