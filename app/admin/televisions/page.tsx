import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TelevisionActions } from "@/components/television-actions"

async function getTelevisions() {
  try {
    const televisions = await sql`
      SELECT * FROM televisions ORDER BY name
    `
    return televisions
  } catch {
    return []
  }
}

export default async function AdminTelevisionsPage() {
  const televisions = await getTelevisions()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Televisions</h1>
        <Button asChild>
          <Link href="/admin/televisions/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Television
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Televisions ({televisions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {televisions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No televisions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Image</th>
                    <th className="text-left py-2 px-2 font-medium">Name</th>
                    <th className="text-left py-2 px-2 font-medium">Description</th>
                    <th className="text-right py-2 px-2 font-medium">Price</th>
                    <th className="text-center py-2 px-2 font-medium">Quantity</th>
                    <th className="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {televisions.map((tv: any) => (
                    <tr key={tv.id} className="border-b last:border-0">
                      <td className="py-2 px-2">
                        <div className="w-16 h-16 bg-muted rounded border relative">
                          {tv.image_url ? (
                            <Image
                              src={tv.image_url}
                              alt={tv.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{tv.name}</td>
                      <td className="py-2 px-2 text-muted-foreground text-sm max-w-xs truncate">
                        {tv.description || "-"}
                      </td>
                      <td className="py-2 px-2 text-right font-medium">
                        Rs. {tv.price?.toLocaleString() || "0.00"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Badge variant={tv.quantity > 0 ? "default" : "secondary"}>
                          {tv.quantity}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <TelevisionActions 
                          id={tv.id}
                          name={tv.name}
                          description={tv.description}
                          price={tv.price}
                          quantity={tv.quantity}
                          imageUrl={tv.image_url}
                        />
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
