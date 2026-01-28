"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Provider {
  id: number
  name: string
  logo_url?: string | null
}

interface AddRouterFormProps {
  providers: Provider[]
}

export function AddRouterForm({ providers: initialProviders }: AddRouterFormProps) {
  const router = useRouter()
  const [providers, setProviders] = useState(initialProviders)
  
  // Provider form state
  const [providerDialogOpen, setProviderDialogOpen] = useState(false)
  const [newProviderName, setNewProviderName] = useState("")
  const [newProviderLogo, setNewProviderLogo] = useState("")
  const [providerLoading, setProviderLoading] = useState(false)
  const [providerError, setProviderError] = useState("")
  const [providerSuccess, setProviderSuccess] = useState("")

  // Router form state
  const [selectedProvider, setSelectedProvider] = useState("")
  const [model, setModel] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault()
    setProviderError("")
    setProviderSuccess("")
    setProviderLoading(true)

    try {
      const res = await fetch("/api/admin/router-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProviderName, logo_url: newProviderLogo }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add provider")
      }

      setProviderSuccess("Provider added successfully!")
      setProviders([...providers, { id: data.id, name: newProviderName, logo_url: newProviderLogo }])
      setNewProviderName("")
      setNewProviderLogo("")
      
      setTimeout(() => {
        setProviderDialogOpen(false)
        setProviderSuccess("")
      }, 1500)
    } catch (err) {
      setProviderError(err instanceof Error ? err.message : "Failed to add provider")
    } finally {
      setProviderLoading(false)
    }
  }

  const handleAddRouter = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/routers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: parseInt(selectedProvider),
          model,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
          description: description || null,
          features: features || null,
          image_url: imageUrl || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add router")
      }

      setSuccess("Router added successfully! Redirecting...")
      
      setTimeout(() => {
        router.push("/admin/routers")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add router")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Add Provider Dialog */}
      <Dialog open={providerDialogOpen} onOpenChange={setProviderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Router Provider</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProvider} className="space-y-4">
            {providerError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{providerError}</AlertDescription>
              </Alert>
            )}
            
            {providerSuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{providerSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="provider-name">Provider Name *</Label>
              <Input
                id="provider-name"
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
                placeholder="e.g., Dialog"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-logo">Logo URL (Optional)</Label>
              <Input
                id="provider-logo"
                value={newProviderLogo}
                onChange={(e) => setNewProviderLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </div>

            <Button type="submit" className="w-full" disabled={providerLoading}>
              {providerLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Provider"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Router Form */}
      <Card>
        <CardHeader>
          <CardTitle>Router Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRouter} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="provider">Provider *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProviderDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Provider
                </Button>
              </div>
              <select
                id="provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Router Model *</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Dialog 4G Home Router"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Router description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (Optional)</Label>
              <Textarea
                id="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g., 4G LTE, WiFi 6, Up to 100Mbps"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL (Optional)</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/router.jpg"
                type="url"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/routers")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Router"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
