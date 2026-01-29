import sql from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const models = await sql`
      SELECT 
        pm.*,
        pb.name as brand_name
      FROM phone_models pm
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name
    `
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching phone models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brand_id, name } = await request.json()

    const result = await sql`
      INSERT INTO phone_models (brand_id, name)
      VALUES (${parseInt(brand_id)}, ${name})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating phone model:', error)
    return NextResponse.json(
      { error: 'Failed to create phone model' },
      { status: 500 }
    )
  }
}
