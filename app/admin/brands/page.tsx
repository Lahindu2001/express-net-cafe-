import sql from '@/lib/db'
import { PhoneBrand } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Plus, Edit } from 'lucide-react'
import Image from 'next/image'
import { PhoneBrandActions } from '@/components/phone-brand-actions'

export default async function BrandsPage() {
  const brands = await sql`
    SELECT 
      pb.*,
      COUNT(pm.id) as model_count
    FROM phone_brands pb
    LEFT JOIN phone_models pm ON pb.id = pm.brand_id
    GROUP BY pb.id, pb.name, pb.logo_url
    ORDER BY pb.name
  ` as (PhoneBrand & { model_count: number })[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Phone Brands</h1>
        <Link href="/admin/brands/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                  <CardTitle className="text-lg">{brand.name}</CardTitle>
                </div>
                <PhoneBrandActions brand={brand} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Brand ID: {brand.id}</span>
                  <Badge variant="secondary">
                    {brand.model_count} models
                  </Badge>
                </div>
                <Link href={`/admin/brands/${brand.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first phone brand.</p>
          <Link href="/admin/brands/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
