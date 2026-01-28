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

    if (body.is_approved !== undefined) {
      await sql`
        UPDATE reviews SET is_approved = ${body.is_approved} WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating review:", error)
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
    await sql`DELETE FROM reviews WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
