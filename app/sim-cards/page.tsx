import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, CreditCard } from "lucide-react"

export default async function SimCardsPage() {
  const user = await getSession()
  
  let providers: Array<{ id: number; name: string; logo_url: string | null }> = []
  let simCards: Array<{
    id: number
    provider_id: number
    provider_name: string
    type: string
    price: number
    quantity: number
  }> = []
  
  try {
    const providersResult = await sql`
      SELECT * FROM sim_providers ORDER BY name
    `
    providers = providersResult as Array<{ id: number; name: string; logo_url: string | null }>
    
    const simCardsResult = await sql`
      SELECT 
        s.id,
        s.provider_id,
        sp.name as provider_name,
        s.type,
        s.price,
        s.quantity
      FROM sim_cards s
      JOIN sim_providers sp ON s.provider_id = sp.id
      ORDER BY sp.name, s.type
    `
    simCards = simCardsResult as Array<{
      id: number
      provider_id: number
      provider_name: string
      type: string
      price: number
      quantity: number
    }>
  } catch {
    // Tables might be empty
  }

  // Group by provider
  const groupedByProvider = simCards.reduce((acc, item) => {
    if (!acc[item.provider_name]) {
      acc[item.provider_name] = {
        provider_id: item.provider_id,
        sims: []
      }
    }
    acc[item.provider_name].sims.push(item)
    return acc
  }, {} as Record<string, { provider_id: number; sims: typeof simCards }>)

  const providerColors: Record<string, string> = {
    "Dialog": "bg-red-500/10 text-red-600 border-red-200",
    "Mobitel": "bg-green-500/10 text-green-600 border-green-200",
    "Hutch": "bg-orange-500/10 text-orange-600 border-orange-200",
    "Airtel": "bg-red-600/10 text-red-700 border-red-200",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">SIM Cards</h1>
              <p className="text-muted-foreground mb-6">
                Get new SIM cards from all major Sri Lankan mobile operators.
              </p>
            </div>
          </div>
        </section>

        {/* Provider Navigation */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-4">Mobile Operators</h2>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <a key={provider.id} href={`#provider-${provider.id}`}>
                  <Badge 
                    variant="outline" 
                    className={`cursor-pointer transition-colors py-2 px-4 ${providerColors[provider.name] || ''}`}
                  >
                    {provider.name}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* SIM Cards List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {Object.entries(groupedByProvider).length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No SIM Cards Available</h3>
                <p className="text-muted-foreground mb-6">
                  Please contact us for available SIM cards.
                </p>
                <Button asChild>
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: 0702882883
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(groupedByProvider).map(([providerName, { provider_id, sims }]) => (
                  <div key={providerName} id={`provider-${provider_id}`} className="scroll-mt-24">
                    <Card className="h-full">
                      <CardHeader className={`${providerColors[providerName]?.split(' ')[0] || 'bg-muted'} rounded-t-lg`}>
                        <CardTitle className="text-xl text-center">{providerName}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {sims.map((sim) => (
                            <div key={sim.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium">{sim.type}</p>
                                {sim.quantity > 0 ? (
                                  <p className="text-sm text-muted-foreground">{sim.quantity} available</p>
                                ) : (
                                  <p className="text-sm text-destructive">Out of stock</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">Rs. {sim.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button asChild className="w-full mt-6">
                          <a href="tel:0702882883">
                            <Phone className="h-4 w-4 mr-2" />
                            Call to Order
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="text-muted-foreground mb-6">
                Not sure which network is best for your area? We can help you choose the right SIM card based on coverage and plans.
              </p>
              <Button asChild size="lg">
                <a href="tel:0702882883">
                  <Phone className="h-4 w-4 mr-2" />
                  Call: 0702882883
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
