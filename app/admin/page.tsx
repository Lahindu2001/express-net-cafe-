import sql from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Package, CreditCard, Wifi, Users, Star, Wrench, TrendingUp, AlertCircle, Plus, Battery, Tv, Award, MessageSquare } from "lucide-react"

async function getStats() {
  try {
    const [
      displayCount,
      batteryCount,
      accessoryCount,
      simCount,
      routerCount,
      televisionCount,
      achievementCount,
      serviceCount,
      userCount,
      reviewCount,
      pendingReviews,
      lowStockAccessories,
      lowStockSims,
      lowStockRouters,
      lowStockTelevisions,
      visitorResult,
      chatStats,
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM display_prices`,
      sql`SELECT COUNT(*) as count FROM battery_prices`,
      sql`SELECT COUNT(*) as count FROM accessories`,
      sql`SELECT COUNT(*) as count FROM sim_cards`,
      sql`SELECT COUNT(*) as count FROM routers`,
      sql`SELECT COUNT(*) as count FROM televisions`,
      sql`SELECT COUNT(*) as count FROM achievements`,
      sql`SELECT COUNT(*) as count FROM services`,
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = true`,
      sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = false`,
      sql`SELECT COUNT(*) as count FROM accessories WHERE quantity <= 5`,
      sql`SELECT COUNT(*) as count FROM sim_cards WHERE quantity <= 10`,
      sql`SELECT COUNT(*) as count FROM routers WHERE quantity <= 3`,
      sql`SELECT COUNT(*) as count FROM televisions WHERE quantity <= 3`,
      sql`SELECT stat_value FROM site_stats WHERE stat_name = 'total_visitors'`,
      sql`
        SELECT 
          COUNT(*) as total_chats,
          COUNT(*) FILTER (WHERE status = 'active') as active_chats,
          (SELECT COUNT(*) FROM chat_messages WHERE sender_type = 'customer' AND is_read = false) as unread_messages
        FROM chat_sessions
      `,
    ])

    return {
      displays: Number(displayCount[0]?.count || 0),
      batteries: Number(batteryCount[0]?.count || 0),
      accessories: Number(accessoryCount[0]?.count || 0),
      sims: Number(simCount[0]?.count || 0),
      routers: Number(routerCount[0]?.count || 0),
      televisions: Number(televisionCount[0]?.count || 0),
      achievements: Number(achievementCount[0]?.count || 0),
      services: Number(serviceCount[0]?.count || 0),
      users: Number(userCount[0]?.count || 0),
      reviews: Number(reviewCount[0]?.count || 0),
      pendingReviews: Number(pendingReviews[0]?.count || 0),
      visitors: Number(visitorResult[0]?.stat_value || 0),
      lowStock: Number(lowStockAccessories[0]?.count || 0) + Number(lowStockSims[0]?.count || 0) + Number(lowStockRouters[0]?.count || 0) + Number(lowStockTelevisions[0]?.count || 0),
      totalChats: Number(chatStats[0]?.total_chats || 0),
      activeChats: Number(chatStats[0]?.active_chats || 0),
      unreadMessages: Number(chatStats[0]?.unread_messages || 0),
    }
  } catch {
    return {
      displays: 0,
      batteries: 0,
      accessories: 0,
      sims: 0,
      routers: 0,
      televisions: 0,
      achievements: 0,
      services: 0,
      users: 0,
      reviews: 0,
      pendingReviews: 0,
      visitors: 0,
      lowStock: 0,
      totalChats: 0,
      activeChats: 0,
      unreadMessages: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: "Display Prices",
      value: stats.displays,
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      href: "/admin/display-prices",
    },
    {
      title: "Battery Prices",
      value: stats.batteries,
      icon: Battery,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      href: "/admin/battery-prices",
    },
    {
      title: "Accessories",
      value: stats.accessories,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      href: "/admin/accessories",
    },
    {
      title: "SIM Cards",
      value: stats.sims,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      href: "/admin/sim-cards",
    },
    {
      title: "Routers",
      value: stats.routers,
      icon: Wifi,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      href: "/admin/routers",
    },
    {
      title: "Televisions",
      value: stats.televisions,
      icon: Tv,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      href: "/admin/televisions",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Wrench,
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
      href: "/admin/services",
    },
    {
      title: "Achievements",
      value: stats.achievements,
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      href: "/admin/achievements",
    },
    {
      title: "Users",
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      href: "/admin/users",
    },
    {
      title: "Customer Chats",
      value: stats.totalChats,
      subtitle: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : `${stats.activeChats} active`,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      href: "/admin/chats",
    },
    {
      title: "Website Visitors",
      value: stats.visitors.toLocaleString(),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      href: "/admin",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      subtitle: stats.pendingReviews > 0 ? `${stats.pendingReviews} pending` : undefined,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      href: "/admin/reviews",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/display-prices/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-semibold">Add Display Price</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New phone model</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/battery-prices/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Battery className="h-4 w-4" />
                    <span className="font-semibold">Add Battery Price</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New battery model</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/accessories/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">Add Accessory</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New product</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/sim-cards/new">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-semibold">Add SIM Card</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New SIM type</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/routers/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Wifi className="h-4 w-4" />
                    <span className="font-semibold">Add Router</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New router model</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/televisions/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Tv className="h-4 w-4" />
                    <span className="font-semibold">Add Television</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New TV model</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/services/new">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="h-4 w-4" />
                    <span className="font-semibold">Add Service</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New service type</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-start">
                <Link href="/admin/reviews">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4" />
                    <span className="font-semibold">Review Approvals</span>
                    {stats.pendingReviews > 0 && (
                      <Badge variant="destructive" className="ml-1">{stats.pendingReviews}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Manage reviews</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStock > 0 ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-900">Low Stock Alert</p>
                    <p className="text-sm text-orange-800">
                      {stats.lowStock} {stats.lowStock === 1 ? 'item' : 'items'} running low on stock
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/admin/accessories">Check Accessories</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/admin/sim-cards">Check SIM Cards</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/admin/routers">Check Routers</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Inventory Healthy</p>
                    <p className="text-sm text-green-800">All items are well stocked</p>
                  </div>
                </div>
              )}

              {stats.pendingReviews > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Pending Reviews</p>
                    <p className="text-sm text-blue-800">
                      {stats.pendingReviews} {stats.pendingReviews === 1 ? 'review' : 'reviews'} waiting for approval
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link href="/admin/reviews">Review Now</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Quick Stats</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Products</p>
                    <p className="font-semibold">{stats.displays + stats.accessories + stats.sims + stats.routers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Services</p>
                    <p className="font-semibold">{stats.services}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Users</p>
                    <p className="font-semibold">{stats.users}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Approved Reviews</p>
                    <p className="font-semibold">{stats.reviews}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Shop Name</p>
                <p className="font-medium">Express Net Cafe</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone / WhatsApp</p>
                <p className="font-medium">0702882883</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Hours</p>
                <p className="font-medium">9:00 AM - 9:00 PM (Closed on Poya Days)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <a 
                  href="https://maps.app.goo.gl/KdSNqvKxFeZMLrpd7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
