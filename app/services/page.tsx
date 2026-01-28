import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Printer, Copy, FileText, ImageIcon, Smartphone, Wrench } from "lucide-react"

const serviceIcons: Record<string, React.ElementType> = {
  "Photocopy": Copy,
  "Printout": Printer,
  "Photo Printing": ImageIcon,
  "Document Scanning": FileText,
  "Mobile Repair": Smartphone,
  "Screen Replacement": Smartphone,
}

export default async function ServicesPage() {
  const user = await getSession()
  
  let services: Array<{
    id: number
    name: string
    description: string | null
    price: number | null
    icon: string | null
  }> = []
  
  try {
    services = await sql`
      SELECT * FROM services ORDER BY name
    `
  } catch {
    // Table might be empty
  }

  // Default services if none in database
  const defaultServices = [
    {
      id: 1,
      name: "Photocopy",
      description: "Black & white and color photocopying services",
      price: null,
      icon: "copy"
    },
    {
      id: 2,
      name: "Printout",
      description: "Document printing in various sizes",
      price: null,
      icon: "printer"
    },
    {
      id: 3,
      name: "Display Replacement",
      description: "Professional screen replacement for all phone models",
      price: null,
      icon: "smartphone"
    },
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-500/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
              <p className="text-muted-foreground mb-6">
                Professional printing, photocopying, and mobile repair services.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service) => {
                const Icon = serviceIcons[service.name] || Wrench
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      {service.description && (
                        <CardDescription>{service.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {service.price ? (
                        <p className="text-lg font-semibold text-primary mb-4">
                          Starting from Rs. {service.price}
                        </p>
                      ) : (
                        <p className="text-muted-foreground mb-4">
                          Contact us for pricing
                        </p>
                      )}
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <a href="tel:0702882883">
                          <Phone className="h-4 w-4 mr-2" />
                          Inquire Now
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Photocopy & Print Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Photocopy & Printing Services</h2>
                <p className="text-muted-foreground">
                  Quality printing and photocopying at affordable prices
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Copy className="h-6 w-6 text-primary" />
                      <CardTitle>Photocopy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Black & White copies
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Color copies
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        A4 and A3 sizes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Bulk copying available
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Printer className="h-6 w-6 text-primary" />
                      <CardTitle>Printout</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Document printing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Photo printing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Various paper sizes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        USB and email printing
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Our Services?</h2>
            <p className="text-muted-foreground mb-6">
              Visit us or call for more information about our services and pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:0702882883">
                  <Phone className="h-4 w-4 mr-2" />
                  Call: 0702882883
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
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
