import React from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Tv, CheckCircle, XCircle } from "lucide-react"

export default async function TelevisionsPage() {
  const user = await getSession()
  
  let televisions: Array<{
    id: number
    name: string
    description: string | null
    price: number
    quantity: number
    image_url: string | null
  }> = []
  
  try {
    const televisionsResult = await sql`
      SELECT * FROM televisions ORDER BY name
    `
    televisions = televisionsResult as Array<{
      id: number
      name: string
      description: string | null
      price: number
      quantity: number
      image_url: string | null
    }>
  } catch {
    // Table might be empty
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-telivision-bg.jpg"
              alt="Televisions Background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-accent/10" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center backdrop-blur-sm border border-purple-500/30 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <Tv className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Televisions
              </h1>
              <p className="text-muted-foreground mb-6 text-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Browse our selection of quality televisions
              </p>
            </div>
          </div>

          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Televisions List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {televisions.length === 0 ? (
              <div className="text-center py-12">
                <Tv className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Televisions Available</h3>
                <p className="text-muted-foreground mb-6">
                  Please contact us for available televisions.
                </p>
                <Button asChild>
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: 0702882883
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {televisions.map((tv) => (
                  <Card key={tv.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-br from-purple-500/10 to-accent/5">
                      <div className="aspect-video w-full bg-white rounded-lg border border-border flex items-center justify-center p-4 mb-4">
                        {tv.image_url ? (
                          <Image
                            src={tv.image_url}
                            alt={tv.name}
                            width={300}
                            height={200}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Tv className="h-20 w-20 text-muted-foreground" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{tv.name}</CardTitle>
                      {tv.description && (
                        <CardDescription className="mt-2">{tv.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-primary mb-1">
                          Rs. {tv.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tv.quantity > 0 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                            </>
                          )}
                        </div>
                        <Button asChild size="sm">
                          <a href="tel:0702882883">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
