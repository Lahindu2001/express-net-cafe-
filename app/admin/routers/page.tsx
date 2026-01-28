import sql from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RouterActions } from "@/components/router-actions"
import { Plus } from "lucide-react"

async function getRouters() {
  try {
    const routers = await sql`
      SELECT 
        r.id,
        rp.name as provider_name,
        r.model,
        r.price,
        r.quantity,
        r.description,
        r.features,
        r.image_url
      FROM routers r
      JOIN router_providers rp ON r.provider_id = rp.id
      ORDER BY rp.name, r.model
    `
    return routers
  } catch {
    return []
  }
}

export default async function AdminRoutersPage() {
  const routers = await getRouters()

  // Group by provider
  const groupedByProvider = routers.reduce((acc, item) => {
    if (!acc[item.provider_name]) {
      acc[item.provider_name] = []
    }
    acc[item.provider_name].push(item)
    return acc
  }, {} as Record<string, typeof routers>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Routers</h1>
        <Button asChild>
          <Link href="/admin/routers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {Object.entries(groupedByProvider).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No routers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByProvider).map(([providerName, items]) => (
            <Card key={providerName}>
              <CardHeader>
                <CardTitle>{providerName}</CardTitle>
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
                      {items.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-2 px-2">{item.model}</td>
                          <td className="py-2 px-2 text-right font-medium">
                            Rs. {item.price.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Badge variant={item.quantity > 0 ? "default" : "secondary"}>
                              {item.quantity}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <RouterActions 
                              id={item.id} 
                              model={item.model}
                              price={item.price}
                              quantity={item.quantity}
                              description={item.description}
                              features={item.features}
                              image_url={item.image_url}
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
