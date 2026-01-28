import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Check if user already has a review
    const existingReview = await sql`
      SELECT id FROM reviews WHERE user_id = ${session.userId}
    `

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already submitted a review" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO reviews (user_id, rating, comment, is_approved)
      VALUES (${session.userId}, ${rating}, ${comment || null}, false)
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
