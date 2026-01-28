import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Headphones, Sigma as Sim, Wifi, Printer, Star, Phone, MapPin, ArrowRight, Shield, Clock, ThumbsUp } from "lucide-react"

async function getApprovedReviews() {
  try {
    const reviews = await sql`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.is_approved = true
      ORDER BY r.created_at DESC
      LIMIT 6
    `
    return reviews
  } catch {
    return []
  }
}

const categories = [
  {
    title: "Display Repair",
    description: "Samsung, Apple, Huawei, Honor & more",
    icon: Smartphone,
    href: "/display-repair",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Accessories",
    description: "Chargers, cables, covers & more",
    icon: Headphones,
    href: "/accessories",
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "SIM Cards",
    description: "Dialog, Mobitel, Hutch, Airtel",
    icon: Sim,
    href: "/sim-cards",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Routers",
    description: "Dialog & Mobitel routers",
    icon: Wifi,
    href: "/routers",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Photocopy & Print",
    description: "Documents, photos & more",
    icon: Printer,
    href: "/services",
    color: "bg-red-500/10 text-red-600",
  },
]

const features = [
  {
    icon: Shield,
    title: "Quality Assured",
    description: "We use high-quality parts for all repairs",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Most repairs completed same day",
  },
  {
    icon: ThumbsUp,
    title: "Expert Technicians",
    description: "Experienced professionals at your service",
  },
]

export default async function HomePage() {
  const user = await getSession()
  
  let reviews: Array<{ id: number; user_name: string; rating: number; comment: string }> = []
  try {
    reviews = await sql`
      SELECT r.id, u.name as user_name, r.rating, r.comment
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.is_approved = true
      ORDER BY r.created_at DESC
      LIMIT 3
    `
  } catch {
    // Reviews table might be empty
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Your Trusted Mobile Repair & Service Center
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
                Expert display replacements, quality accessories, SIM cards, routers, and printing services all under one roof.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/display-repair">
                    View Repair Prices
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4" />
                    Call Now: 0702882883
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From mobile repairs to accessories, we have got everything you need
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link key={category.title} href={category.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <category.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
                <p className="text-muted-foreground">What our customers say about us</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      <p className="font-medium">{review.user_name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Location Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Visit Our Shop</h2>
                <p className="text-muted-foreground">Find us on the map</p>
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.123456789!2d79.861234!3d6.921234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMTYuNSJOIDc5wrA1MScyMC40IkU!5e0!3m2!1sen!2slk!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 text-center">
                <Button asChild variant="outline" className="gap-2 bg-transparent">
                  <a 
                    href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Read reviews from our satisfied customers
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-base">{review.user_name}</CardTitle>
                      <CardDescription>
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </CardHeader>
                    {review.comment && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help With Your Device?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Contact us today for expert assistance with your mobile phone repairs and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <a href="tel:0702882883">
                  <Phone className="h-4 w-4" />
                  Call: 0702882883
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <a 
                  href="https://wa.me/94702882883" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
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
