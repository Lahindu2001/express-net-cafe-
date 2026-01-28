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
    const { provider_id, model, price, quantity, description, features, image_url } = body

    if (!provider_id || !model || price === undefined) {
      return NextResponse.json(
        { error: "Provider, model, and price are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO routers (provider_id, model, price, quantity, description, features, image_url)
      VALUES (${provider_id}, ${model}, ${price}, ${quantity || 0}, ${description || null}, ${features || null}, ${image_url || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding router:", error)
    return NextResponse.json({ error: "Failed to add router" }, { status: 500 })
  }
}
