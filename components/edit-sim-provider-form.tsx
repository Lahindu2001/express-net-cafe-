'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/image-upload'
import { Building2 } from 'lucide-react'
import { SimProvider } from '@/lib/types'

interface EditSimProviderFormProps {
  provider: SimProvider
}

export function EditSimProviderForm({ provider }: EditSimProviderFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: provider.name,
    logo_url: provider.logo_url || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/sim-providers/${provider.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/sim-providers')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update SIM provider')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Edit SIM Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Provider Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter provider name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Provider Logo</Label>
            <ImageUpload
              onUpload={(url) => setFormData({ ...formData, logo_url: url })}
              folder="sim-providers"
              currentImage={formData.logo_url}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Updating...' : 'Update Provider'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/sim-providers')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
