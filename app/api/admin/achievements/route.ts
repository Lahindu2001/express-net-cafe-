import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const achievements = await sql`
      SELECT * FROM achievements ORDER BY created_at DESC
    `
    return NextResponse.json(achievements)
  } catch (error) {
    console.error("Failed to fetch achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, year, image_url } = body

    const result = await sql`
      INSERT INTO achievements (title, description, year, image_url)
      VALUES (${title}, ${description}, ${year}, ${image_url})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create achievement:", error)
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 })
  }
}
