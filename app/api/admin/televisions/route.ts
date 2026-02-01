import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const televisions = await sql`
      SELECT * FROM televisions ORDER BY name
    `
    return NextResponse.json(televisions)
  } catch (error) {
    console.error("Error fetching televisions:", error)
    return NextResponse.json({ error: "Failed to fetch televisions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, quantity, image_url } = body

    const result = await sql`
      INSERT INTO televisions (name, description, price, quantity, image_url)
      VALUES (${name}, ${description}, ${price}, ${quantity}, ${image_url})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating television:", error)
    return NextResponse.json({ error: "Failed to create television" }, { status: 500 })
  }
}
