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
    const { category_id, name, description, price, quantity, image_url, compatible_models } = body

    if (!category_id || !name || price === undefined) {
      return NextResponse.json(
        { error: "Category, name, and price are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO accessories (category_id, name, description, price, quantity, image_url, compatible_models)
      VALUES (${category_id}, ${name}, ${description || null}, ${price}, ${quantity || 0}, ${image_url || null}, ${compatible_models || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding accessory:", error)
    return NextResponse.json({ error: "Failed to add accessory" }, { status: 500 })
  }
}
