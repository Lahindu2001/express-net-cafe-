import sql from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceActions } from "@/components/service-actions"
import { Plus } from "lucide-react"

async function getServices() {
  try {
    const services = await sql`
      SELECT id, name, description, price, price_unit, icon
      FROM services
      ORDER BY name
    `
    return services
  } catch {
    return []
  }
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No services found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Name</th>
                    <th className="text-left py-2 px-2 font-medium">Description</th>
                    <th className="text-right py-2 px-2 font-medium">Price</th>
                    <th className="text-left py-2 px-2 font-medium">Unit</th>
                    <th className="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium">{service.name}</td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {service.description || "-"}
                      </td>
                      <td className="py-2 px-2 text-right">
                        {service.price ? `Rs. ${service.price.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {service.price_unit || "-"}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <ServiceActions 
                          id={service.id} 
                          name={service.name}
                          description={service.description}
                          price={service.price}
                          price_unit={service.price_unit}
                          icon={service.icon}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
