import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddRouterForm } from "@/components/add-router-form"

async function getProviders() {
  try {
    const providers = await sql`SELECT id, name, logo_url FROM router_providers ORDER BY name`
    return providers
  } catch {
    return []
  }
}

export default async function NewRouterPage() {
  const providers = await getProviders()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add Router</h1>

      <div className="space-y-6">
        <AddRouterForm providers={providers} />
      </div>
    </div>
  )
}
