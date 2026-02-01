import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const batteryPrice = await sql`
      SELECT 
        bp.*,
        pm.name as model_name,
        pb.name as brand_name
      FROM battery_prices bp
      JOIN phone_models pm ON bp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      WHERE bp.id = ${id}
    `

    if (batteryPrice.length === 0) {
      return NextResponse.json({ error: "Battery price not found" }, { status: 404 })
    }

    return NextResponse.json(batteryPrice[0])
  } catch (error) {
    console.error('Error fetching battery price:', error)
    return NextResponse.json({ error: "Failed to fetch battery price" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { model_id, battery_type, image_url, price, quantity, notes } = body

    if (!model_id || !battery_type || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      UPDATE battery_prices 
      SET 
        model_id = ${model_id},
        battery_type = ${battery_type},
        image_url = ${image_url || null},
        price = ${price},
        quantity = ${quantity || 0},
        notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Battery price not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating battery price:', error)
    return NextResponse.json({ error: "Failed to update battery price" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await sql`DELETE FROM battery_prices WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting battery price:', error)
    return NextResponse.json({ error: "Failed to delete battery price" }, { status: 500 })
  }
}
