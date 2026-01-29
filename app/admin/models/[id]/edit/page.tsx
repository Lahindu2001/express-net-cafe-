import sql from '@/lib/db'
import { PhoneModel, PhoneBrand } from '@/lib/types'
import { EditPhoneModelForm } from '@/components/edit-phone-model-form'
import { notFound } from 'next/navigation'

interface EditPhoneModelPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPhoneModelPage({ params }: EditPhoneModelPageProps) {
  const { id } = await params
  
  const models = await db`
    SELECT * FROM phone_models WHERE id = ${parseInt(id)}
  ` as PhoneModel[]
  
  const model = models[0]
  if (!model) {
    notFound()
  }

  const brands = await sql`
    SELECT * FROM phone_brands ORDER BY name
  ` as PhoneBrand[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Phone Model</h1>
        <p className="text-gray-600">Update model information.</p>
      </div>

      <EditPhoneModelForm model={model} brands={brands} />
    </div>
  )
}
