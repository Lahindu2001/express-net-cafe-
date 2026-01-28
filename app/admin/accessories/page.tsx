import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AccessoryActions } from "@/components/accessory-actions"

async function getAccessories() {
  try {
    const accessories = await sql`
      SELECT 
        a.id,
        ac.name as category_name,
        a.name,
        a.description,
        a.price,
        a.quantity,
        a.image_url,
        a.compatible_models
      FROM accessories a
      JOIN accessory_categories ac ON a.category_id = ac.id
      ORDER BY ac.name, a.name
    `
    return accessories
  } catch {
    return []
  }
}

export default async function AdminAccessoriesPage() {
  const accessories = await getAccessories()

  // Group by category
  const groupedByCategory = accessories.reduce((acc, item) => {
    if (!acc[item.category_name]) {
      acc[item.category_name] = []
    }
    acc[item.category_name].push(item)
    return acc
  }, {} as Record<string, typeof accessories>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accessories</h1>
        <Button asChild>
          <Link href="/admin/accessories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {Object.entries(groupedByCategory).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No accessories found</p>
            <Button asChild>
              <Link href="/admin/accessories/new">Add First Accessory</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([categoryName, items]) => (
            <Card key={categoryName}>
              <CardHeader>
                <CardTitle>{categoryName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium">Name</th>
                        <th className="text-right py-2 px-2 font-medium">Price</th>
                        <th className="text-center py-2 px-2 font-medium">Quantity</th>
                        <th className="text-right py-2 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-2 px-2">{item.name}</td>
                          <td className="py-2 px-2 text-right font-medium">
                            Rs. {item.price.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Badge variant={item.quantity > 0 ? "default" : "secondary"}>
                              {item.quantity}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <AccessoryActions 
                              id={item.id} 
                              name={item.name}
                              description={item.description}
                              price={item.price}
                              quantity={item.quantity}
                              imageUrl={item.image_url}
                              compatibleModels={item.compatible_models}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
