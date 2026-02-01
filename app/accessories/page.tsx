import React from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Phone, Search, Package, Cable, Shield, BatteryCharging, Headphones, Smartphone } from "lucide-react"
import Link from "next/link"

const categoryIcons: Record<string, React.ElementType> = {
  "Chargers": BatteryCharging,
  "Cables": Cable,
  "Back Covers": Shield,
  "Tempered Glass": Smartphone,
  "Charging Docks": Package,
  "Handsfree": Headphones,
  "Power Banks": BatteryCharging,
}

export default async function AccessoriesPage() {
  const user = await getSession()
  
  let categories: Array<{ id: number; name: string; icon: string | null; image_url: string | null }> = []
  let accessories: Array<{
    id: number
    category_id: number
    category_name: string
    name: string
    description: string | null
    price: number
    quantity: number
    image_url: string | null
  }> = []
  
  try {
    const categoriesResult = await sql`
      SELECT * FROM accessory_categories ORDER BY name
    `
    categories = categoriesResult as Array<{ id: number; name: string; icon: string | null; image_url: string | null }>
    
    const accessoriesResult = await sql`
      SELECT 
        a.id,
        a.category_id,
        ac.name as category_name,
        a.name,
        a.description,
        a.price,
        a.quantity,
        a.image_url
      FROM accessories a
      JOIN accessory_categories ac ON a.category_id = ac.id
      ORDER BY ac.name, a.name
    `
    accessories = accessoriesResult as Array<{
      id: number
      category_id: number
      category_name: string
      name: string
      description: string | null
      price: number
      quantity: number
      image_url: string | null
    }>
  } catch {
    // Tables might be empty
  }

  // Group by category
  const groupedByCategory = accessories.reduce((acc, item) => {
    if (!acc[item.category_name]) {
      acc[item.category_name] = {
        category_id: item.category_id,
        items: []
      }
    }
    acc[item.category_name].items.push(item)
    return acc
  }, {} as Record<string, { category_id: number; items: typeof accessories }>)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/accessories-bg.jpg"
              alt="Mobile Accessories Background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
            {/* Additional colored gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-accent/10" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center backdrop-blur-sm border border-green-500/30 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <Package className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Mobile Accessories
              </h1>
              <p className="text-muted-foreground mb-6 text-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Quality chargers, cables, covers, tempered glass, and more for your device.
              </p>
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <form action="/search" className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search accessories..."
                    className="flex-1"
                  />
                  <input type="hidden" name="category" value="accessories" />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Category Navigation */}
        <section className="py-6 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {categories.map((category) => {
                const Icon = categoryIcons[category.name] || Package
                return (
                  <a 
                    key={category.id} 
                    href={`#category-${category.id}`}
                    className="group"
                  >
                    <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 overflow-hidden h-full">
                      <CardContent className="p-3 flex flex-col items-center justify-center min-h-[90px]">
                        {category.image_url ? (
                          <div className="relative w-full h-12 mb-2">
                            <Image
                              src={category.image_url}
                              alt={category.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                            <Icon className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-center group-hover:text-primary transition-colors leading-tight">
                          {category.name}
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Accessories List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {Object.entries(groupedByCategory).length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Accessories Available</h3>
                <p className="text-muted-foreground mb-6">
                  Please contact us for available accessories.
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
                {Object.entries(groupedByCategory).map(([categoryName, { category_id, items }]) => {
                  const Icon = categoryIcons[categoryName] || Package
                  return (
                    <div key={categoryName} id={`category-${category_id}`} className="scroll-mt-24">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        {categoryName}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                          <Card key={item.id} className={item.quantity === 0 ? 'opacity-60' : ''}>
                            {item.image_url && (
                              <div className="relative h-40 w-full bg-muted rounded-t-lg overflow-hidden">
                                <Image
                                  src={item.image_url || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-4"
                                />
                              </div>
                            )}
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{item.name}</CardTitle>
                                  {item.description && (
                                    <CardDescription className="mt-1">{item.description}</CardDescription>
                                  )}
                                </div>
                                {item.quantity === 0 && (
                                  <Badge variant="secondary">Out of Stock</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-bold text-primary">
                                    Rs. {Number(item.price).toLocaleString()}
                                  </span>
                                  {item.quantity > 0 && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.quantity} in stock
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
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
