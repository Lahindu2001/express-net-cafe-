import { AddPhoneBrandForm } from '@/components/add-phone-brand-form'

export default function NewPhoneBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Phone Brand</h1>
        <p className="text-gray-600">Create a new phone brand.</p>
      </div>

      <AddPhoneBrandForm />
    </div>
  )
}
