import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession, hashPassword, verifyPassword } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, phone, currentPassword, newPassword } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // If changing password
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        )
      }

      const users = await sql`
        SELECT password_hash FROM users WHERE id = ${session.userId}
      `

      if (users.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      const isValid = await verifyPassword(currentPassword, users[0].password_hash)

      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }

      const newHash = await hashPassword(newPassword)

      await sql`
        UPDATE users 
        SET name = ${name}, phone = ${phone || null}, password_hash = ${newHash}
        WHERE id = ${session.userId}
      `
    } else {
      await sql`
        UPDATE users 
        SET name = ${name}, phone = ${phone || null}
        WHERE id = ${session.userId}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
