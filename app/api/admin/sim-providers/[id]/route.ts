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
    const providers = await sql`
      SELECT * FROM sim_providers WHERE id = ${parseInt(id)}
    `
    
    if (providers.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }
    
    return NextResponse.json(providers[0])
  } catch (error) {
    console.error('Error fetching SIM provider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SIM provider' },
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
      UPDATE sim_providers 
      SET name = ${name}, logo_url = ${logo_url || null}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating SIM provider:', error)
    return NextResponse.json(
      { error: 'Failed to update SIM provider' },
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

    // Check if provider has SIM cards
    const simCards = await sql`
      SELECT COUNT(*) as count FROM sim_cards WHERE provider_id = ${parseInt(id)}
    `
    
    if (parseInt(simCards[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete provider with existing SIM cards' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM sim_providers WHERE id = ${parseInt(id)} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Provider deleted successfully' })
  } catch (error) {
    console.error('Error deleting SIM provider:', error)
    return NextResponse.json(
      { error: 'Failed to delete SIM provider' },
      { status: 500 }
    )
  }
}
