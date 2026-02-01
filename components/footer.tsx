import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock, ShoppingBag } from "lucide-react"
import { getSession } from "@/lib/auth"
import { ReviewForm } from "@/components/review-form"

export async function Footer() {
  const session = await getSession()
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Express Net Cafe Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="font-bold text-lg">Express Net Cafe</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Since 2010, your trusted destination for mobile phone repairs, accessories, SIM cards, routers, and printing services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/display-repair" className="text-muted-foreground hover:text-primary transition-colors">
                    Display Repair
                  </Link>
                </li>
                <li>
                  <Link href="/battery-replacement" className="text-muted-foreground hover:text-primary transition-colors">
                    Battery Replacement
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="text-muted-foreground hover:text-primary transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/sim-cards" className="text-muted-foreground hover:text-primary transition-colors">
                    SIM Cards
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/routers" className="text-muted-foreground hover:text-primary transition-colors">
                    Routers
                  </Link>
                </li>
                <li>
                  <Link href="/televisions" className="text-muted-foreground hover:text-primary transition-colors">
                    Televisions
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:0702882883" className="hover:text-primary transition-colors">
                  0702882883
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>WhatsApp: 0702882883</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  View on Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p>Monday - Sunday</p>
                <p className="font-medium text-foreground">9:00 AM - 9:00 PM</p>
                <p className="text-destructive mt-1">Closed on Poya Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <ReviewForm userId={session?.userId} isLoggedIn={!!session} />
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Express Net Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
