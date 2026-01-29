import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const brandFilter = searchParams.get("brand")
    const offset = (page - 1) * limit

    let query = sql`
      SELECT 
        dp.id,
        dp.model_id,
        dp.display_type,
        dp.price,
        dp.quantity,
        dp.notes,
        dp.created_at,
        dp.updated_at,
        pm.name as model_name,
        pb.name as brand_name
      FROM display_prices dp
      JOIN phone_models pm ON dp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
    `

    if (brandFilter && brandFilter !== "all") {
      query = sql`
        SELECT 
          dp.id,
          dp.model_id,
          dp.display_type,
          dp.price,
          dp.quantity,
          dp.notes,
          dp.created_at,
          dp.updated_at,
          pm.name as model_name,
          pb.name as brand_name
        FROM display_prices dp
        JOIN phone_models pm ON dp.model_id = pm.id
        JOIN phone_brands pb ON pm.brand_id = pb.id
        WHERE pb.name = ${brandFilter}
      `
    }

    const displayPrices = await sql`
      ${query}
      ORDER BY pb.name, pm.name, dp.display_type
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalCountResult = await sql`
      SELECT COUNT(*) as total
      FROM display_prices dp
      JOIN phone_models pm ON dp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ${brandFilter && brandFilter !== "all" ? sql`WHERE pb.name = ${brandFilter}` : sql``}
    `

    const totalCount = parseInt(totalCountResult[0].total)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      displayPrices,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error("Error fetching display prices:", error)
    return NextResponse.json({ error: "Failed to fetch display prices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { model_id, display_type, price, quantity, notes } = body

    if (!model_id || !display_type || price === undefined) {
      return NextResponse.json(
        { error: "Model ID, display type, and price are required" },
        { status: 400 }
      )
    }

    // Check if this combination already exists
    const existing = await sql`
      SELECT id FROM display_prices 
      WHERE model_id = ${model_id} AND display_type = ${display_type}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Display price for this model and type already exists" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO display_prices (model_id, display_type, price, quantity, notes)
      VALUES (${model_id}, ${display_type}, ${price}, ${quantity || 0}, ${notes || null})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding display price:", error)
    return NextResponse.json({ error: "Failed to add display price" }, { status: 500 })
  }
}
