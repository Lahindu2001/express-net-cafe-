import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Wifi } from "lucide-react"

export default async function RoutersPage() {
  const user = await getSession()
  
  let providers: Array<{ id: number; name: string; logo_url: string | null }> = []
  let routers: Array<{
    id: number
    provider_id: number
    provider_name: string
    name: string
    description: string | null
    price: number
    quantity: number
    image_url: string | null
  }> = []
  
  try {
    const providersResult = await sql`
      SELECT * FROM router_providers ORDER BY name
    `
    providers = providersResult as Array<{ id: number; name: string; logo_url: string | null }>
    
    const routersResult = await sql`
      SELECT 
        r.id,
        r.provider_id,
        rp.name as provider_name,
        r.model as name,
        r.description,
        r.price,
        r.quantity,
        r.image_url
      FROM routers r
      JOIN router_providers rp ON r.provider_id = rp.id
      ORDER BY rp.name, r.model
    `
    routers = routersResult as Array<{
      id: number
      provider_id: number
      provider_name: string
      name: string
      description: string | null
      price: number
      quantity: number
      image_url: string | null
    }>
  } catch {
    // Tables might be empty
  }

  // Group by provider
  const groupedByProvider = routers.reduce((acc, item) => {
    if (!acc[item.provider_name]) {
      acc[item.provider_name] = {
        provider_id: item.provider_id,
        routers: []
      }
    }
    acc[item.provider_name].routers.push(item)
    return acc
  }, {} as Record<string, { provider_id: number; routers: typeof routers }>)

  const providerColors: Record<string, string> = {
    "Dialog": "bg-red-500/10 text-red-600",
    "Mobitel": "bg-green-500/10 text-green-600",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-500/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">WiFi Routers</h1>
              <p className="text-muted-foreground mb-6">
                High-speed internet routers from Dialog and Mobitel.
              </p>
            </div>
          </div>
        </section>

        {/* Provider Navigation */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-4">Select Provider</h2>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <a key={provider.id} href={`#provider-${provider.id}`}>
                  <Badge 
                    variant="outline" 
                    className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4 flex items-center gap-2`}
                  >
                    <Wifi className="h-4 w-4" />
                    {provider.name}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Routers List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {Object.entries(groupedByProvider).length === 0 ? (
              <div className="text-center py-12">
                <Wifi className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Routers Available</h3>
                <p className="text-muted-foreground mb-6">
                  Please contact us for available routers.
                </p>
                <Button asChild>
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: 0702882883
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedByProvider).map(([providerName, { provider_id, routers: providerRouters }]) => (
                  <div key={providerName} id={`provider-${provider_id}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${providerColors[providerName] || 'bg-muted'} flex items-center justify-center`}>
                        <Wifi className="h-5 w-5" />
                      </div>
                      {providerName} Routers
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {providerRouters.map((router) => (
                        <Card key={router.id} className={router.quantity === 0 ? 'opacity-60' : ''}>
                          {router.image_url && (
                            <div className="relative h-40 w-full bg-muted rounded-t-lg overflow-hidden">
                              <Image
                                src={router.image_url || "/placeholder.svg"}
                                alt={router.name}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{router.name}</CardTitle>
                                {router.description && (
                                  <CardDescription className="mt-1">{router.description}</CardDescription>
                                )}
                              </div>
                              {router.quantity === 0 && (
                                <Badge variant="secondary">Out of Stock</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-primary">
                                  Rs. {Number(router.price).toLocaleString()}
                                </span>
                                {router.quantity > 0 && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {router.quantity} in stock
                                  </p>
                                )}
                              </div>
                              <Button size="sm" asChild>
                                <a href="tel:0702882883">
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
              <h2 className="text-2xl font-bold mb-4">Need Internet Setup Help?</h2>
              <p className="text-muted-foreground mb-6">
                We can help you choose the right router and data plan for your home or office. Contact us for expert advice.
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
