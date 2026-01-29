'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/image-upload'
import { Smartphone } from 'lucide-react'

export function AddPhoneBrandForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    logo_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/phone-brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/brands')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create phone brand')
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
          <Smartphone className="h-5 w-5" />
          Phone Brand Details
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
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Brand Logo</Label>
            <ImageUpload
              onUpload={(url) => setFormData({ ...formData, logo_url: url })}
              folder="phone-brands"
              currentImage={formData.logo_url}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Brand'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/brands')}
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
