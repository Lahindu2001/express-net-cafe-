import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Battery, Headphones, Sigma as Sim, Wifi, Printer, Star, Phone, MapPin, ArrowRight, Shield, Clock, ThumbsUp, CheckCircle, Award, Tv } from "lucide-react"

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
    description: "Samsung, Apple, Huawei, Honor & more • 1 Month Warranty",
    icon: Smartphone,
    href: "/display-repair",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Battery Replacement",
    description: "Original & compatible batteries • 1 Month Warranty",
    icon: Battery,
    href: "/battery-replacement",
    color: "bg-red-500/10 text-red-600",
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
    title: "Televisions",
    description: "Wide selection of televisions",
    icon: Tv,
    href: "/televisions",
    color: "bg-indigo-500/10 text-indigo-600",
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
    description: "16+ years experience with NVQ4 certified professionals",
  },
]

export default async function HomePage() {
  const user = await getSession()
  
  let reviews: any[] = []
  let achievements: any[] = []
  let phoneModelsCount = 0
  let visitorCount = 0
  
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

  try {
    achievements = await sql`
      SELECT * FROM achievements ORDER BY year DESC, created_at DESC
    `
  } catch (error) {
    console.error('Failed to fetch achievements:', error)
    achievements = []
  }

  try {
    const modelCountResult = await sql`
      SELECT COUNT(*) as count FROM phone_models
    `
    phoneModelsCount = Number(modelCountResult[0]?.count || 0)
  } catch {
    // Table might be empty
  }

  try {
    // Increment visitor count
    await sql`
      INSERT INTO site_stats (stat_name, stat_value) 
      VALUES ('total_visitors', 1)
      ON CONFLICT (stat_name) 
      DO UPDATE SET stat_value = site_stats.stat_value + 1, updated_at = CURRENT_TIMESTAMP
    `
    
    // Get current visitor count
    const visitorResult = await sql`
      SELECT stat_value FROM site_stats WHERE stat_name = 'total_visitors'
    `
    visitorCount = Number(visitorResult[0]?.stat_value || 0)
  } catch {
    // Table might not exist yet
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.jpg"
              alt="Mobile Repair Background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
            {/* Additional colored gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <Image
                    src="/logo.png"
                    alt="Express Net Cafe Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                  />
                </div>
              </div>
              
              {/* Since 2010 Badge */}
              <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-4 duration-1000 delay-50">
                <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-amber-500/50 backdrop-blur-sm shadow-lg">
                  <Award className="h-6 w-6 text-amber-600 animate-pulse" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Established</span>
                    <span className="text-lg font-bold text-amber-900">Since 2010</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Your Trusted Mobile
                <br />
                <span className="text-primary">Repair & Service Center</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 text-pretty max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Expert phone repairing, quality accessories, SIM cards, routers, and printing services all under one roof.
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 mb-8 text-pretty max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-250">
                <span className="font-semibold text-amber-700">15+ years</span> of excellence • Serving <span className="font-semibold text-amber-700">100,000+</span> satisfied customers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Button asChild size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Link href="/display-repair">
                    View Repair Prices
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all backdrop-blur-sm">
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4" />
                    Call: 0702882883
                  </a>
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Same Day Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span>Expert Technicians</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm md:text-base text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100,000+</div>
                <div className="text-sm md:text-base text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{phoneModelsCount}+</div>
                <div className="text-sm md:text-base text-muted-foreground">Phone Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{visitorCount.toLocaleString()}+</div>
                <div className="text-sm md:text-base text-muted-foreground">Website Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">12/7</div>
                <div className="text-sm md:text-base text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1">Our Services</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From mobile repairs to accessories, we have got everything you need
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {categories.map((category, index) => (
                <Link key={category.title} href={category.href} className="group">
                  <Card className="h-full hover:shadow-2xl hover:border-primary transition-all duration-300 cursor-pointer hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20">
                    <CardHeader className="text-center pb-6 pt-8">
                      <div className={`w-20 h-20 mx-auto rounded-2xl ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <category.icon className="h-10 w-10" />
                      </div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{category.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
                      <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1">Why Choose Us</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Service You Can Trust</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={feature.title} className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-background to-muted/30 group">
                  <CardHeader className="py-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="h-9 w-9 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements & Awards Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50/50 via-background to-yellow-50/30 dark:from-amber-950/10 dark:via-background dark:to-yellow-950/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-amber-500/30 text-amber-700">Recognition</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Achievements & Awards</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Celebrating excellence and milestones in mobile repair services
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-16">
              {/* Always show "In Process" section */}
              <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-amber-100/50 to-yellow-100/50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-3xl border-2 border-amber-300/30">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mt-8 text-amber-900 dark:text-amber-100">In Process</h3>
                <p className="text-muted-foreground text-center max-w-md mt-4">
                  We are working on documenting more achievements and awards. Check back soon to see our latest milestones!
                </p>
              </div>

              {/* Display existing achievements if any */}
              {achievements.length > 0 && (
                <>
                  {(() => {
                    // Group achievements by year
                    const achievementsByYear = achievements.reduce((acc: any, achievement: any) => {
                      const year = achievement.year
                      if (!acc[year]) {
                        acc[year] = []
                      }
                      acc[year].push(achievement)
                      return acc
                    }, {})

                    // Sort years in descending order
                    const sortedYears = Object.keys(achievementsByYear).sort((a, b) => parseInt(b) - parseInt(a))

                  return sortedYears.map((year, yearIndex) => (
                    <div key={year} className={`flex flex-col ${yearIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start`}>
                      {/* Year Badge - Left or Right */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                            <span className="text-3xl font-bold text-white">{year}</span>
                          </div>
                          <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-amber-400 animate-pulse" />
                        </div>
                      </div>

                      {/* Achievements Grid */}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-6">
                          {achievementsByYear[year].map((achievement: any) => (
                            <Card 
                              key={achievement.id} 
                              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-card border border-border group"
                            >
                              <div className="flex flex-col md:flex-row gap-0">
                                {/* Image Section */}
                                <div className="relative w-full md:w-64 h-64 flex-shrink-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
                                  {achievement.image_url ? (
                                    <Image
                                      src={achievement.image_url}
                                      alt={achievement.title}
                                      fill
                                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                      sizes="(max-width: 768px) 100vw, 256px"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Award className="h-20 w-20 text-amber-400/40" />
                                    </div>
                                  )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
                                      <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Achievement</span>
                                  </div>
                                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    {achievement.title}
                                  </h3>
                                  {achievement.description ? (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {achievement.description}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-muted-foreground/50 italic">
                                      No description available
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                })()}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <Badge variant="outline" className="mb-4 px-4 py-1">Testimonials</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Read reviews from our satisfied customers
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/30">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{review.user_name}</CardTitle>
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
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help With Your Device?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
              Contact us today for expert assistance with your mobile phone repairs and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="gap-2 shadow-xl hover:shadow-2xl transition-all">
                <a href="tel:0702882883">
                  <Phone className="h-5 w-5" />
                  Call: 0702882883
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 bg-primary-foreground/10 shadow-lg hover:shadow-xl transition-all">
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
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
        </section>

        {/* Location Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4 px-4 py-1">Visit Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Shop</h2>
                <p className="text-muted-foreground">Find us on the map</p>
              </div>
              <Card className="overflow-hidden shadow-lg">
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
                <Button asChild variant="outline" size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all">
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help With Your Device?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
              Contact us today for expert assistance with your mobile phone repairs and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="gap-2 shadow-xl hover:shadow-2xl transition-all">
                <a href="tel:0702882883">
                  <Phone className="h-5 w-5" />
                  Call: 0702882883
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 bg-primary-foreground/10 shadow-lg hover:shadow-xl transition-all">
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
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
        </section>
      </main>

      <Footer />
      
      {/* Floating Chat Widget */}
      <ChatWidget />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Express Net Cafe",
            "image": "https://www.expressnetcafe.com/logo.png",
            "description": "Mobile repair shop in dompe, Sri Lanka offering display repair, battery replacement, accessories, SIM cards, routers, televisions, and photocopy services",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "346, Medalanda, Dompe, Doepe",
              "addressLocality": "dompe",
              "addressRegion": "Galle",
              "addressCountry": "LK"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "6.2920",
              "longitude": "80.1644"
            },
            "telephone": "+94702882883",
            "priceRange": "$$",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "09:00",
              "closes": "21:00"
            },
            "url": "https://www.expressnetcafe.com",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "100"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Mobile Repair Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Display Repair",
                    "description": "Samsung, Apple, Huawei, Honor display repairs with 1 month warranty"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Battery Replacement",
                    "description": "Original and compatible batteries with 1 month warranty"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile Accessories",
                    "description": "Chargers, cables, covers and more mobile accessories"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SIM Cards",
                    "description": "Dialog, Mobitel, Hutch, Airtel SIM cards"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Routers",
                    "description": "Dialog and Mobitel routers"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Photocopy & Print Services",
                    "description": "Document and photo printing services"
                  }
                }
              ]
            }
          })
        }}
      />
    </div>
  )
}
