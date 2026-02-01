import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddBatteryPriceForm } from "@/components/add-battery-price-form"

async function getBrands() {
  try {
    const brands = await sql`SELECT id, name FROM phone_brands ORDER BY name`
    return brands as Array<{ id: number; name: string }>
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
    return models as Array<{ id: number; name: string; brand_id: number; brand_name: string }>
  } catch {
    return []
  }
}

export default async function NewBatteryPricePage() {
  const user = await getSession()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  const brands = await getBrands()
  const models = await getModels()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add Battery Price</h1>

      <div className="space-y-6">
        <AddBatteryPriceForm brands={brands} models={models} />
      </div>
    </div>
  )
}
