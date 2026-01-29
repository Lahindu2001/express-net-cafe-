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
    const models = await sql`
      SELECT 
        pm.*,
        pb.name as brand_name
      FROM phone_models pm
      JOIN phone_brands pb ON pm.brand_id = pb.id
      WHERE pm.id = ${parseInt(id)}
    `
    
    if (models.length === 0) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }
    
    return NextResponse.json(models[0])
  } catch (error) {
    console.error('Error fetching phone model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone model' },
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
    const { brand_id, name } = await request.json()

    const result = await sql`
      UPDATE phone_models 
      SET brand_id = ${parseInt(brand_id)}, name = ${name}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating phone model:', error)
    return NextResponse.json(
      { error: 'Failed to update phone model' },
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

    // Check if model has display prices
    const displayPrices = await sql`
      SELECT COUNT(*) as count FROM display_prices WHERE model_id = ${parseInt(id)}
    `
    
    if (parseInt(displayPrices[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete model with existing display prices' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM phone_models WHERE id = ${parseInt(id)} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Model deleted successfully' })
  } catch (error) {
    console.error('Error deleting phone model:', error)
    return NextResponse.json(
      { error: 'Failed to delete phone model' },
      { status: 500 }
    )
  }
}
