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
    const { name, logo_url } = body

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO phone_brands (name, logo_url)
      VALUES (${name}, ${logo_url || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding brand:", error)
    return NextResponse.json({ error: "Failed to add brand" }, { status: 500 })
  }
}
