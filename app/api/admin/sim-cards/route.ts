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
    const { provider_id, type, price, quantity, description } = body

    if (!provider_id || !type || price === undefined) {
      return NextResponse.json(
        { error: "Provider, type, and price are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO sim_cards (provider_id, type, price, quantity, description)
      VALUES (${provider_id}, ${type}, ${price}, ${quantity || 0}, ${description || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding SIM card:", error)
    return NextResponse.json({ error: "Failed to add SIM card" }, { status: 500 })
  }
}
