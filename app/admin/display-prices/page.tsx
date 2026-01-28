import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DisplayPriceActions } from "@/components/display-price-actions"

async function getDisplayPrices() {
  try {
    const prices = await sql`
      SELECT 
        dp.id,
        pb.name as brand_name,
        pm.name as model_name,
        dp.display_type,
        dp.price,
        dp.quantity,
        dp.notes
      FROM display_prices dp
      JOIN phone_models pm ON dp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name, dp.display_type
    `
    return prices
  } catch {
    return []
  }
}

export default async function AdminDisplayPricesPage() {
  const prices = await getDisplayPrices()

  // Group by brand
  const groupedByBrand = prices.reduce((acc, item) => {
    if (!acc[item.brand_name]) {
      acc[item.brand_name] = []
    }
    acc[item.brand_name].push(item)
    return acc
  }, {} as Record<string, typeof prices>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Display Prices</h1>
        <Button asChild>
          <Link href="/admin/display-prices/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {Object.entries(groupedByBrand).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No display prices found</p>
            <Button asChild>
              <Link href="/admin/display-prices/new">Add First Display Price</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByBrand).map(([brandName, items]) => (
            <Card key={brandName}>
              <CardHeader>
                <CardTitle>{brandName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium">Model</th>
                        <th className="text-left py-2 px-2 font-medium">Display Type</th>
                        <th className="text-right py-2 px-2 font-medium">Price</th>
                        <th className="text-center py-2 px-2 font-medium">Quantity</th>
                        <th className="text-right py-2 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-2 px-2">{item.model_name}</td>
                          <td className="py-2 px-2 text-muted-foreground">{item.display_type}</td>
                          <td className="py-2 px-2 text-right font-medium">
                            Rs. {item.price.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Badge variant={item.quantity > 0 ? "default" : "secondary"}>
                              {item.quantity}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <DisplayPriceActions 
                              id={item.id} 
                              quantity={item.quantity}
                              price={item.price}
                              displayType={item.display_type}
                              notes={item.notes}
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
