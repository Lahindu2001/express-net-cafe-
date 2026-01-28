import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddDisplayPriceForm } from "@/components/add-display-price-form"

async function getBrands() {
  try {
    const brands = await sql`SELECT id, name FROM phone_brands ORDER BY name`
    return brands
  } catch {
    return []
  }
}

async function getModels() {
  try {
    const models = await sql`
      SELECT pm.id, pm.name, pm.brand_id, pb.name as brand_name 
      FROM phone_models pm
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name
    `
    return models
  } catch {
    return []
  }
}

export default async function NewDisplayPricePage() {
  const brands = await getBrands()
  const models = await getModels()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add Display Price</h1>

      <div className="space-y-6">
        <AddDisplayPriceForm brands={brands} models={models} />
      </div>
    </div>
  )
}
