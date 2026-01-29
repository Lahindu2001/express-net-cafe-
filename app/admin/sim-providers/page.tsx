import sql from '@/lib/db'
import { SimProvider } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { SimProviderActions } from '@/components/sim-provider-actions'

export default async function SimProvidersPage() {
  const providers = await sql`
    SELECT * FROM sim_providers ORDER BY name
  ` as SimProvider[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SIM Providers</h1>
        <Link href="/admin/sim-providers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {provider.logo_url ? (
                    <Image
                      src={provider.logo_url}
                      alt={`${provider.name} logo`}
                      width={32}
                      height={32}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-gray-400" />
                  )}
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                </div>
                <SimProviderActions provider={provider} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Provider ID: {provider.id}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/sim-providers/${provider.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first SIM provider.</p>
          <Link href="/admin/sim-providers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
