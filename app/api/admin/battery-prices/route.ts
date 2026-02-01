import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  try {
    const batteryPrices = await sql`
      SELECT 
        bp.id,
        bp.model_id,
        bp.battery_type,
        bp.image_url,
        bp.price,
        bp.quantity,
        bp.notes,
        pm.name as model_name,
        pb.name as brand_name
      FROM battery_prices bp
      JOIN phone_models pm ON bp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name
    `
    return NextResponse.json(batteryPrices)
  } catch (error) {
    console.error('Error fetching battery prices:', error)
    return NextResponse.json({ error: "Failed to fetch battery prices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { model_id, battery_type, image_url, price, quantity, notes } = body

    if (!model_id || !battery_type || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO battery_prices (model_id, battery_type, image_url, price, quantity, notes)
      VALUES (${model_id}, ${battery_type}, ${image_url || null}, ${price}, ${quantity || 0}, ${notes || null})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating battery price:', error)
    return NextResponse.json({ error: "Failed to create battery price" }, { status: 500 })
  }
}
