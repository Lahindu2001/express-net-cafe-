import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SimCardActions } from "@/components/sim-card-actions"

async function getSimCards() {
  try {
    const simCards = await sql`
      SELECT 
        s.id,
        sp.name as provider_name,
        s.type,
        s.price,
        s.quantity,
        s.description
      FROM sim_cards s
      JOIN sim_providers sp ON s.provider_id = sp.id
      ORDER BY sp.name, s.type
    `
    return simCards
  } catch {
    return []
  }
}

export default async function AdminSimCardsPage() {
  const simCards = await getSimCards()

  // Group by provider
  const groupedByProvider = simCards.reduce((acc, item) => {
    if (!acc[item.provider_name]) {
      acc[item.provider_name] = []
    }
    acc[item.provider_name].push(item)
    return acc
  }, {} as Record<string, typeof simCards>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">SIM Cards</h1>
        <Button asChild>
          <Link href="/admin/sim-cards/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {Object.entries(groupedByProvider).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No SIM cards found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedByProvider).map(([providerName, items]) => (
            <Card key={providerName}>
              <CardHeader>
                <CardTitle>{providerName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">Rs. {item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.quantity > 0 ? "default" : "secondary"}>
                          {item.quantity} in stock
                        </Badge>
                        <SimCardActions 
                          id={item.id} 
                          type={item.type}
                          price={item.price}
                          quantity={item.quantity}
                          description={item.description}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
