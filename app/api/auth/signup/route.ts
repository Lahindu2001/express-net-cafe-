import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (${name}, ${email}, ${phone || null}, ${passwordHash}, 'customer')
      RETURNING id, name, email, role
    `

    const user = result[0]
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    )
  }
}
