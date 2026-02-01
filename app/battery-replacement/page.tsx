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
import { Phone, Search, Battery, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface BatteryReplacementPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function BatteryReplacementPage({ searchParams }: BatteryReplacementPageProps) {
  const user = await getSession()
  const params = await searchParams
  const searchQuery = params.q || ""
  
  let brands: Array<{ id: number; name: string; logo_url: string | null }> = []
  let batteryPrices: Array<{
    id: number
    brand_name: string
    brand_id: number
    model_name: string
    model_image: string | null
    battery_type: string
    image_url: string | null
    price: number
    quantity: number
  }> = []
  
  try {
    const brandsResult = await sql`
      SELECT * FROM phone_brands ORDER BY name
    `
    brands = brandsResult as Array<{ id: number; name: string; logo_url: string | null }>
    
    // Build search query
    if (searchQuery) {
      const searchTerm = `%${searchQuery}%`
      const batteryPricesResult = await sql`
        SELECT 
          bp.id,
          pb.name as brand_name,
          pb.id as brand_id,
          pm.name as model_name,
          pm.image_url as model_image,
          bp.battery_type,
          bp.image_url,
          bp.price,
          bp.quantity
        FROM battery_prices bp
        JOIN phone_models pm ON bp.model_id = pm.id
        JOIN phone_brands pb ON pm.brand_id = pb.id
        WHERE LOWER(pm.name) LIKE LOWER(${searchTerm})
           OR LOWER(pb.name) LIKE LOWER(${searchTerm})
           OR LOWER(bp.battery_type) LIKE LOWER(${searchTerm})
        ORDER BY pb.name, pm.name
      `
      batteryPrices = batteryPricesResult as Array<{
        id: number
        brand_name: string
        brand_id: number
        model_name: string
        model_image: string | null
        battery_type: string
        image_url: string | null
        price: number
        quantity: number
      }>
    } else {
      const batteryPricesResult = await sql`
        SELECT 
          bp.id,
          pb.name as brand_name,
          pb.id as brand_id,
          pm.name as model_name,
          pm.image_url as model_image,
          bp.battery_type,
          bp.image_url,
          bp.price,
          bp.quantity
        FROM battery_prices bp
        JOIN phone_models pm ON bp.model_id = pm.id
        JOIN phone_brands pb ON pm.brand_id = pb.id
        ORDER BY pb.name, pm.name
        LIMIT 100
      `
      batteryPrices = batteryPricesResult as Array<{
        id: number
        brand_name: string
        brand_id: number
        model_name: string
        model_image: string | null
        battery_type: string
        image_url: string | null
        price: number
        quantity: number
      }>
    }
  } catch (error) {
    console.error('Database error:', error)
    // Tables might be empty or not exist yet
  }

  // Group by brand
  const groupedByBrand = batteryPrices.reduce((acc, item) => {
    if (!acc[item.brand_name]) {
      acc[item.brand_name] = {
        brand_id: item.brand_id,
        batteries: []
      }
    }
    acc[item.brand_name].batteries.push(item)
    return acc
  }, {} as Record<string, { brand_id: number; batteries: typeof batteryPrices }>)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/battery-replacement-bg.jpg"
              alt="Battery Replacement Background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
            {/* Additional colored gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-accent/10" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center backdrop-blur-sm border border-yellow-500/30 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <Battery className="h-10 w-10 text-yellow-600" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Battery Replacement
              </h1>
              <p className="text-muted-foreground mb-3 text-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Original and compatible batteries for all phone models
              </p>
              <div className="flex items-center justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-250">
                <Badge className="bg-green-500/20 text-green-700 border-green-500/50 px-4 py-1.5 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  1 Month Warranty
                </Badge>
              </div>

              {/* Search */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <form action="/battery-replacement" method="get" className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search by brand or model..."
                    defaultValue={searchQuery}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Search Results Info */}
        {searchQuery && (
          <section className="py-4 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-3">
                <p className="text-sm">
                  Found <strong>{batteryPrices.length}</strong> result{batteryPrices.length !== 1 ? 's' : ''} for &quot;<strong>{searchQuery}</strong>&quot;
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/battery-replacement">Clear Search</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Brand Navigation */}
        {!searchQuery && (
        <section className="py-6 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Select Brand</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {brands.map((brand) => (
                <a 
                  key={brand.id} 
                  href={`#brand-${brand.id}`}
                  className="group"
                >
                  <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 overflow-hidden">
                    <CardContent className="p-2 flex flex-col items-center justify-center min-h-[70px]">
                      {brand.logo_url ? (
                        <div className="relative w-full h-8 mb-1">
                          <Image
                            src={brand.logo_url}
                            alt={brand.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      ) : (
                        <Battery className="h-6 w-6 mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <span className="text-[10px] font-medium text-center group-hover:text-primary transition-colors leading-tight">
                        {brand.name}
                      </span>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Battery Prices */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {batteryPrices.length === 0 ? (
              <div className="text-center py-12">
                <Battery className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Battery Prices Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'Try searching with different keywords.' : 'Battery prices will appear here once added.'}
                </p>
                <Button asChild>
                  <a href="tel:0702882883">
                    <Phone className="h-4 w-4 mr-2" />
                    Call for Information
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedByBrand).map(([brandName, { brand_id, batteries }]) => (
                  <div key={brandName} id={`brand-${brand_id}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">{brandName}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batteries.map((battery) => (
                        <Card key={battery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardHeader className="bg-gradient-to-br from-yellow-500/10 to-accent/5">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 bg-white rounded-lg border border-border flex-shrink-0 p-2">
                                {battery.image_url ? (
                                  <Image
                                    src={battery.image_url}
                                    alt={`${battery.model_name} Battery`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                  />
                                ) : battery.model_image ? (
                                  <Image
                                    src={battery.model_image}
                                    alt={battery.model_name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Battery className="w-full h-full text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{battery.model_name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{battery.battery_type}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                {battery.quantity > 0 ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-destructive" />
                                    <span className="text-sm text-destructive font-medium">Out of Stock</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <Button asChild className="w-full">
                              <a href="tel:0702882883">
                                <Phone className="h-4 w-4 mr-2" />
                                Call to Order
                              </a>
                            </Button>
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
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Why Replace Your Battery?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <Battery className="h-8 w-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Fast Charging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Restore your phone's original battery performance
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Quality Parts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Original and high-quality compatible batteries
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Expert Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Professional installation by trained technicians
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
