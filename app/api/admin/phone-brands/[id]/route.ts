import sql from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const brands = await sql`
      SELECT * FROM phone_brands WHERE id = ${parseInt(id)}
    `
    
    if (brands.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }
    
    return NextResponse.json(brands[0])
  } catch (error) {
    console.error('Error fetching phone brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone brand' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name, logo_url } = await request.json()

    const result = await sql`
      UPDATE phone_brands 
      SET name = ${name}, logo_url = ${logo_url || null}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating phone brand:', error)
    return NextResponse.json(
      { error: 'Failed to update phone brand' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if brand has models
    const models = await sql`
      SELECT COUNT(*) as count FROM phone_models WHERE brand_id = ${parseInt(id)}
    `
    
    if (parseInt(models[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with existing models' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM phone_brands WHERE id = ${parseInt(id)} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Brand deleted successfully' })
  } catch (error) {
    console.error('Error deleting phone brand:', error)
    return NextResponse.json(
      { error: 'Failed to delete phone brand' },
      { status: 500 }
    )
  }
}
