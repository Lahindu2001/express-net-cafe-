import { AddSimProviderForm } from '@/components/add-sim-provider-form'

export default function NewSimProviderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add SIM Provider</h1>
        <p className="text-gray-600">Create a new SIM card provider.</p>
      </div>

      <AddSimProviderForm />
    </div>
  )
}
