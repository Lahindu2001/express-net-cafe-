import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, icon } = body

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO accessory_categories (name, icon)
      VALUES (${name}, ${icon || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}
