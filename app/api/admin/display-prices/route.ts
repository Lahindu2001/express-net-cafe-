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
    const { model_id, display_type, price, quantity, notes } = body

    if (!model_id || !display_type || price === undefined) {
      return NextResponse.json(
        { error: "Model ID, display type, and price are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO display_prices (model_id, display_type, price, quantity, notes)
      VALUES (${model_id}, ${display_type}, ${price}, ${quantity || 0}, ${notes || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding display price:", error)
    return NextResponse.json({ error: "Failed to add display price" }, { status: 500 })
  }
}
