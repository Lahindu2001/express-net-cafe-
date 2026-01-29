import sql from '@/lib/db'
import { SimProvider } from '@/lib/types'
import { EditSimProviderForm } from '@/components/edit-sim-provider-form'
import { notFound } from 'next/navigation'

interface EditSimProviderPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSimProviderPage({ params }: EditSimProviderPageProps) {
  const { id } = await params
  
  const providers = await sql`
    SELECT * FROM sim_providers WHERE id = ${parseInt(id)}
  ` as SimProvider[]
  
  const provider = providers[0]
  if (!provider) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit SIM Provider</h1>
        <p className="text-gray-600">Update provider information.</p>
      </div>

      <EditSimProviderForm provider={provider} />
    </div>
  )
}
