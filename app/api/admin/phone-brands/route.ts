import sql from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const brands = await sql`
      SELECT * FROM phone_brands ORDER BY name
    `
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching phone brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone brands' },
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

    const { name, logo_url } = await request.json()

    const result = await sql`
      INSERT INTO phone_brands (name, logo_url)
      VALUES (${name}, ${logo_url || null})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating phone brand:', error)
    return NextResponse.json(
      { error: 'Failed to create phone brand' },
      { status: 500 }
    )
  }
}
