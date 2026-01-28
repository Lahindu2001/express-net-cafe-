import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddSimCardForm } from "@/components/add-sim-card-form"

async function getProviders() {
  try {
    const providers = await sql`SELECT id, name, logo_url FROM sim_providers ORDER BY name`
    return providers
  } catch {
    return []
  }
}

export default async function NewSimCardPage() {
  const providers = await getProviders()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add SIM Card</h1>

      <div className="space-y-6">
        <AddSimCardForm providers={providers} />
      </div>
    </div>
  )
}
