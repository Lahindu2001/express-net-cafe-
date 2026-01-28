import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddAccessoryForm } from "@/components/add-accessory-form"

async function getCategories() {
  try {
    const categories = await sql`SELECT id, name, icon FROM accessory_categories ORDER BY name`
    return categories as Array<{ id: number; name: string; icon: string | null }>
  } catch {
    return []
  }
}

export default async function NewAccessoryPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add new Accessory</h1>

      <div className="space-y-6">
        <AddAccessoryForm categories={categories} />
      </div>
    </div>
  )
}
