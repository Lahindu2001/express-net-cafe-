import { Card } from "@/components/ui/card"
import { AddServiceForm } from "@/components/add-service-form"

export default async function NewServicePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add Service</h1>

      <div className="space-y-6">
        <AddServiceForm />
      </div>
    </div>
  )
}
