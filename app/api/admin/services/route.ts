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
    const { name, description, price, price_unit, icon } = body

    if (!name || price === undefined || !price_unit) {
      return NextResponse.json(
        { error: "Name, price, and price unit are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO services (name, description, price, price_unit, icon)
      VALUES (${name}, ${description || null}, ${price}, ${price_unit}, ${icon || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding service:", error)
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 })
  }
}
