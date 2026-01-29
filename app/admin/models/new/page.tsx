import sql from '@/lib/db'
import { PhoneBrand } from '@/lib/types'
import { AddPhoneModelForm } from '@/components/add-phone-model-form'

export default async function NewPhoneModelPage() {
  const brands = await sql`
    SELECT * FROM phone_brands ORDER BY name
  ` as PhoneBrand[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Phone Model</h1>
        <p className="text-gray-600">Create a new phone model.</p>
      </div>

      <AddPhoneModelForm brands={brands} />
    </div>
  )
}
