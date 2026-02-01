import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Battery, Plus } from "lucide-react"
import { BatteryPriceActions } from "@/components/battery-price-actions"

export default async function AdminBatteryPricesPage() {
  const user = await getSession()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  let batteryPrices: Array<{
    id: number
    brand_name: string
    brand_id: number
    model_name: string
    model_id: number
    model_image: string | null
    battery_type: string
    image_url: string | null
    price: number
    quantity: number
  }> = []

  try {
    const result = await sql`
      SELECT 
        bp.id,
        pb.name as brand_name,
        pb.id as brand_id,
        pm.name as model_name,
        pm.id as model_id,
        pm.image_url as model_image,
        bp.battery_type,
        bp.image_url,
        bp.price,
        bp.quantity
      FROM battery_prices bp
      JOIN phone_models pm ON bp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name, bp.battery_type
    `
    batteryPrices = result as typeof batteryPrices
  } catch (error) {
    console.error('Database error:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Battery Prices</h1>
          <p className="text-muted-foreground">Manage battery replacement pricing</p>
        </div>
        <Button asChild>
          <Link href="/admin/battery-prices/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Battery Price
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Battery Prices ({batteryPrices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {batteryPrices.length === 0 ? (
            <div className="text-center py-12">
              <Battery className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No battery prices added yet.</p>
              <Button asChild>
                <Link href="/admin/battery-prices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Battery Price
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Model</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batteryPrices.map((battery) => (
                    <tr key={battery.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded border border-border flex-shrink-0 p-1">
                            {battery.model_image ? (
                              <Image
                                src={battery.model_image}
                                alt={battery.model_name}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Battery className="w-full h-full text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{battery.model_name}</p>
                            <p className="text-sm text-muted-foreground">{battery.brand_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{battery.battery_type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {battery.image_url ? (
                          <div className="w-12 h-12 bg-white rounded border border-border p-1">
                            <Image
                              src={battery.image_url}
                              alt="Battery"
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No image</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary">Rs. {battery.price}</span>
                      </td>
                      <td className="py-3 px-4">
                        {battery.quantity > 0 ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                            {battery.quantity} in stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                            Out of stock
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <BatteryPriceActions batteryPrice={battery} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
