import sql from '@/lib/db'
import { PhoneModel, PhoneBrand } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Plus, Edit } from 'lucide-react'
import Image from 'next/image'
import { PhoneModelActions } from '@/components/phone-model-actions'

export default async function ModelsPage() {
  const models = await sql`
    SELECT 
      pm.*,
      pb.name as brand_name,
      pb.logo_url as brand_logo,
      COUNT(dp.id) as price_count
    FROM phone_models pm
    JOIN phone_brands pb ON pm.brand_id = pb.id
    LEFT JOIN display_prices dp ON pm.id = dp.model_id
    GROUP BY pm.id, pm.brand_id, pm.name, pm.image_url, pm.created_at, pb.name, pb.logo_url
    ORDER BY pb.name, pm.name
  ` as (PhoneModel & { brand_logo: string, price_count: number })[]

  const brands = await sql`
    SELECT * FROM phone_brands ORDER BY name
  ` as PhoneBrand[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Phone Models</h1>
        <Link href="/admin/models/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Model
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {brands.map((brand) => {
          const brandModels = models.filter(model => model.brand_id === brand.id)
          if (brandModels.length === 0) return null

          return (
            <div key={brand.id} className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={`${brand.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <Smartphone className="h-8 w-8 text-gray-400" />
                )}
                <h2 className="text-xl font-semibold">{brand.name}</h2>
                <Badge variant="secondary">
                  {brandModels.length} models
                </Badge>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {brandModels.map((model) => (
                  <Card key={model.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        <PhoneModelActions model={model} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Model ID:</span>
                          <span>{model.id}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Prices:</span>
                          <Badge variant="secondary">
                            {model.price_count} entries
                          </Badge>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Link href={`/admin/models/${model.id}/edit`}>
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
            </div>
          )
        })}
      </div>

      {models.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first phone model.</p>
          <Link href="/admin/models/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
