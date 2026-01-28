import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Phone, Search, Smartphone, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { DisplayPriceSearch } from "@/components/display-price-search"

export default async function DisplayRepairPage() {
  const user = await getSession()
  
  let brands: Array<{ id: number; name: string; logo_url: string | null }> = []
  let displayPrices: Array<{
    id: number
    brand_name: string
    brand_id: number
    model_name: string
    model_image: string | null
    display_type: string
    quantity: number
  }> = []
  
  try {
    brands = await sql`
      SELECT * FROM phone_brands ORDER BY name
    `
    
    displayPrices = await sql`
      SELECT 
        dp.id,
        pb.name as brand_name,
        pb.id as brand_id,
        pm.name as model_name,
        pm.image_url as model_image,
        dp.display_type,
        dp.quantity
      FROM display_prices dp
      JOIN phone_models pm ON dp.model_id = pm.id
      JOIN phone_brands pb ON pm.brand_id = pb.id
      ORDER BY pb.name, pm.name
    `
  } catch {
    // Tables might be empty
  }

  // Group by brand
  const groupedByBrand = displayPrices.reduce((acc, item) => {
    if (!acc[item.brand_name]) {
      acc[item.brand_name] = {
        brand_id: item.brand_id,
        models: []
      }
    }
    acc[item.brand_name].models.push(item)
    return acc
  }, {} as Record<string, { brand_id: number; models: typeof displayPrices }>)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Display Replacement Prices</h1>
              <p className="text-muted-foreground mb-6">
                Find repair prices for all major mobile phone brands. Call us for selling prices.
              </p>
              <DisplayPriceSearch />
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-900 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Note:</strong> This page shows display availability only. For prices, please call us at{" "}
                <a href="tel:0702882883" className="underline font-semibold">0702882883</a>
              </p>
            </div>
          </div>
        </section>

        {/* Brand Navigation */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-4">Select Brand</h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <a key={brand.id} href={`#brand-${brand.id}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4">
                    {brand.name}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Price Lists by Brand */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {Object.entries(groupedByBrand).length === 0 ? (
              <div className="text-center py-12">
                <Smartphone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Display Prices Available</h3>
                <p className="text-muted-foreground mb-6">
                  Please contact us for display replacement prices.
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
                {Object.entries(groupedByBrand).map(([brandName, { brand_id, models }]) => {
                  return (
                    <div key={brandName} id={`brand-${brand_id}`} className="scroll-mt-24">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-primary" />
                        {brandName}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {models.map((item) => (
                          <Card key={item.id} className={item.quantity <= 0 ? 'opacity-60 border-destructive/30' : 'border-accent/30'}>
                            {item.model_image && (
                              <div className="relative h-32 w-full bg-muted rounded-t-lg overflow-hidden">
                                <Image
                                  src={item.model_image || "/placeholder.svg"}
                                  alt={item.model_name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight">{item.model_name}</CardTitle>
                                {item.quantity > 0 ? (
                                  <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1 shrink-0">
                                    <CheckCircle className="h-3 w-3" />
                                    Available
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                                    <XCircle className="h-3 w-3" />
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                              <CardDescription>{item.display_type || 'Original Display'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Call for price
                                </span>
                                <Button size="sm" asChild>
                                  <a href="tel:0702882883">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Now
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Can not find your model?</h2>
            <p className="text-muted-foreground mb-6">
              Contact us and we will help you find the right display for your phone.
            </p>
            <Button asChild size="lg">
              <a href="tel:0702882883">
                <Phone className="h-4 w-4 mr-2" />
                Call: 0702882883
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
