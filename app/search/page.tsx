import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Smartphone, Package, Wifi } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const user = await getSession()
  const params = await searchParams
  const query = params.q || ""
  const category = params.category || "all"

  let displayResults: Array<{
    id: number
    brand_name: string
    model_name: string
    category: string
    price: number
    quality: string
    in_stock: boolean
  }> = []

  let accessoryResults: Array<{
    id: number
    category_name: string
    name: string
    description: string | null
    price: number
    quantity: number
  }> = []

  let routerResults: Array<{
    id: number
    provider_name: string
    name: string
    description: string | null
    price: number
    quantity: number
  }> = []

  if (query) {
    const searchTerm = `%${query}%`
    
    try {
      if (category === "all" || category === "display") {
        const results = await sql`
          SELECT 
            dp.id,
            pb.name as brand_name,
            pm.name as model_name,
            pm.category,
            dp.price,
            dp.quality,
            dp.in_stock
          FROM display_prices dp
          JOIN phone_models pm ON dp.model_id = pm.id
          JOIN phone_brands pb ON pm.brand_id = pb.id
          WHERE LOWER(pm.name) LIKE LOWER(${searchTerm})
             OR LOWER(pb.name) LIKE LOWER(${searchTerm})
             OR LOWER(pm.category) LIKE LOWER(${searchTerm})
             OR LOWER(dp.quality) LIKE LOWER(${searchTerm})
          ORDER BY pb.name, pm.name
          LIMIT 50
        `
        displayResults = results as Array<{
          id: number
          brand_name: string
          model_name: string
          category: string
          price: number
          quality: string
          in_stock: boolean
        }>
      }

      if (category === "all" || category === "accessories") {
        const results = await sql`
          SELECT 
            a.id,
            ac.name as category_name,
            a.name,
            a.description,
            a.price,
            a.quantity
          FROM accessories a
          JOIN accessory_categories ac ON a.category_id = ac.id
          WHERE LOWER(a.name) LIKE LOWER(${searchTerm})
             OR LOWER(a.description) LIKE LOWER(${searchTerm})
             OR LOWER(ac.name) LIKE LOWER(${searchTerm})
          ORDER BY a.name
          LIMIT 20
        `
        accessoryResults = results as Array<{
          id: number
          category_name: string
          name: string
          description: string | null
          price: number
          quantity: number
        }>
      }

      if (category === "all" || category === "routers") {
        const results = await sql`
          SELECT 
            r.id,
            rp.name as provider_name,
            r.name,
            r.description,
            r.price,
            r.quantity
          FROM routers r
          JOIN router_providers rp ON r.provider_id = rp.id
          WHERE LOWER(r.name) LIKE LOWER(${searchTerm})
             OR LOWER(r.description) LIKE LOWER(${searchTerm})
             OR LOWER(rp.name) LIKE LOWER(${searchTerm})
          ORDER BY r.name
          LIMIT 20
        `
        routerResults = results as Array<{
          id: number
          provider_name: string
          name: string
          description: string | null
          price: number
          quantity: number
        }>
      }
    } catch {
      // Tables might not exist yet
    }
  }

  const totalResults = displayResults.length + accessoryResults.length + routerResults.length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-muted/50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold mb-4 text-center">Search Products</h1>
              <form action="/search" className="flex gap-2">
                <Input
                  type="search"
                  name="q"
                  placeholder="Search for phones, accessories, routers..."
                  defaultValue={query}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Link href={`/search?q=${query}&category=all`}>
                  <Badge variant={category === "all" ? "default" : "outline"} className="cursor-pointer">
                    All
                  </Badge>
                </Link>
                <Link href={`/search?q=${query}&category=display`}>
                  <Badge variant={category === "display" ? "default" : "outline"} className="cursor-pointer">
                    Display Repair
                  </Badge>
                </Link>
                <Link href={`/search?q=${query}&category=accessories`}>
                  <Badge variant={category === "accessories" ? "default" : "outline"} className="cursor-pointer">
                    Accessories
                  </Badge>
                </Link>
                <Link href={`/search?q=${query}&category=routers`}>
                  <Badge variant={category === "routers" ? "default" : "outline"} className="cursor-pointer">
                    Routers
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {query ? (
              <>
                <p className="text-muted-foreground mb-8 text-center">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>

                {totalResults === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try a different search term or contact us directly.
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
                    {/* Display Results */}
                    {displayResults.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-primary" />
                          Display Replacement ({displayResults.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {displayResults.map((item) => (
                            <Card key={item.id} className={!item.in_stock ? 'opacity-60' : ''}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardDescription>{item.brand_name}</CardDescription>
                                    <CardTitle className="text-base">{item.model_name}</CardTitle>
                                  </div>
                                  {!item.in_stock && (
                                    <Badge variant="secondary">Out of Stock</Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-bold text-primary">
                                    Rs. {item.price.toLocaleString()}
                                  </span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href="tel:0702882883">
                                      <Phone className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button asChild variant="link">
                            <Link href="/display-repair">View All Display Prices</Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Accessory Results */}
                    {accessoryResults.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Accessories ({accessoryResults.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {accessoryResults.map((item) => (
                            <Card key={item.id} className={item.quantity === 0 ? 'opacity-60' : ''}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardDescription>{item.category_name}</CardDescription>
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                  </div>
                                  {item.quantity === 0 && (
                                    <Badge variant="secondary">Out of Stock</Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-xl font-bold text-primary">
                                      Rs. {item.price.toLocaleString()}
                                    </span>
                                    {item.quantity > 0 && (
                                      <p className="text-sm text-muted-foreground">{item.quantity} in stock</p>
                                    )}
                                  </div>
                                  <Button size="sm" asChild>
                                    <a href="tel:0702882883">
                                      <Phone className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button asChild variant="link">
                            <Link href="/accessories">View All Accessories</Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Router Results */}
                    {routerResults.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-primary" />
                          Routers ({routerResults.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {routerResults.map((item) => (
                            <Card key={item.id} className={item.quantity === 0 ? 'opacity-60' : ''}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardDescription>{item.provider_name}</CardDescription>
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                  </div>
                                  {item.quantity === 0 && (
                                    <Badge variant="secondary">Out of Stock</Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-xl font-bold text-primary">
                                      Rs. {item.price.toLocaleString()}
                                    </span>
                                    {item.quantity > 0 && (
                                      <p className="text-sm text-muted-foreground">{item.quantity} in stock</p>
                                    )}
                                  </div>
                                  <Button size="sm" asChild>
                                    <a href="tel:0702882883">
                                      <Phone className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button asChild variant="link">
                            <Link href="/routers">View All Routers</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search Our Products</h3>
                <p className="text-muted-foreground">
                  Enter a search term to find display prices, accessories, and more.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
