"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"
import { 
  LayoutDashboard, 
  Smartphone, 
  Package, 
  CreditCard, 
  Wifi, 
  Wrench, 
  Star, 
  Users, 
  Home,
  LogOut,
  ShoppingBag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Display Prices", href: "/admin/display-prices", icon: Smartphone },
  { name: "Phone Brands", href: "/admin/brands", icon: Smartphone },
  { name: "Phone Models", href: "/admin/models", icon: Smartphone },
  { name: "Accessories", href: "/admin/accessories", icon: Package },
  { name: "SIM Cards", href: "/admin/sim-cards", icon: CreditCard },
  { name: "SIM Providers", href: "/admin/sim-providers", icon: CreditCard },
  { name: "Routers", href: "/admin/routers", icon: Wifi },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Users", href: "/admin/users", icon: Users },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-bold">Express Net Cafe</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href="/">
              <Home className="h-4 w-4 mr-1" />
              Site
            </Link>
          </Button>
          <LogoutButton 
            variant="button" 
            showIcon={true}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-3"
          />
        </div>
      </div>
    </div>
  )
}
