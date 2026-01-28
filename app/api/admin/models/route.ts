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
    const { brand_id, name, image_url } = body

    if (!brand_id || !name) {
      return NextResponse.json({ error: "Brand ID and model name are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO phone_models (brand_id, name, image_url)
      VALUES (${brand_id}, ${name}, ${image_url || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding model:", error)
    return NextResponse.json({ error: "Failed to add model" }, { status: 500 })
  }
}
