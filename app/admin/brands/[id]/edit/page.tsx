import sql from '@/lib/db'
import { PhoneBrand } from '@/lib/types'
import { EditPhoneBrandForm } from '@/components/edit-phone-brand-form'
import { notFound } from 'next/navigation'

interface EditPhoneBrandPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPhoneBrandPage({ params }: EditPhoneBrandPageProps) {
  const { id } = await params
  
  const brands = await sql`
    SELECT * FROM phone_brands WHERE id = ${parseInt(id)}
  ` as PhoneBrand[]
  
  const brand = brands[0]
  if (!brand) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Phone Brand</h1>
        <p className="text-gray-600">Update brand information.</p>
      </div>

      <EditPhoneBrandForm brand={brand} />
    </div>
  )
}
