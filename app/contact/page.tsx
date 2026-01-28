import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageCircle, MapPin, Clock, Mail } from "lucide-react"

export default async function ContactPage() {
  const user = await getSession()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-muted-foreground">
                Get in touch with us for all your mobile repair and service needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:0702882883" 
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    0702882883
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://wa.me/94702882883"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-green-600 hover:underline"
                  >
                    0702882883
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Google Maps
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-7 w-7 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">9:00 AM - 9:00 PM</p>
                  <p className="text-sm text-muted-foreground">Daily (except Poya days)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Find Us</h2>
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
                <Button asChild size="lg">
                  <a 
                    href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you need a display replacement, accessories, or printing services, 
              we are here to help. Call us or visit our shop today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:0702882883">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href="https://wa.me/94702882883"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
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
