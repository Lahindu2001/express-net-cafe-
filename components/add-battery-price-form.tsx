"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface Brand {
  id: number
  name: string
}

interface Model {
  id: number
  name: string
  brand_id: number
  brand_name: string
}

interface AddBatteryPriceFormProps {
  brands: Brand[]
  models: Model[]
}

export function AddBatteryPriceForm({ brands, models }: AddBatteryPriceFormProps) {
  const router = useRouter()
  
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [batteryType, setBatteryType] = useState("Original")
  const [imageUrl, setImageUrl] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Filter models by selected brand
  const filteredModels = selectedBrand
    ? models.filter((m) => m.brand_id === parseInt(selectedBrand))
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!selectedModel || !batteryType || !price) {
        throw new Error("Please fill in all required fields")
      }

      const res = await fetch("/api/admin/battery-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: parseInt(selectedModel),
          battery_type: batteryType,
          image_url: imageUrl || null,
          price: parseFloat(price),
          quantity: quantity ? parseInt(quantity) : 0,
          notes: notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add battery price")
      }

      setSuccess("Battery price added successfully!")
      
      // Reset form
      setSelectedBrand("")
      setSelectedModel("")
      setBatteryType("Original")
      setImageUrl("")
      setPrice("")
      setQuantity("")
      setNotes("")
      
      setTimeout(() => {
        router.push("/admin/battery-prices")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Battery Price Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setSelectedModel("") // Reset model when brand changes
                }}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
                disabled={!selectedBrand}
              >
                <option value="">Select a model</option>
                {filteredModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batteryType">Battery Type *</Label>
              <select
                id="batteryType"
                value={batteryType}
                onChange={(e) => setBatteryType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="Original">Original</option>
                <option value="Compatible">Compatible</option>
                <option value="High Capacity">High Capacity</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="2500.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Battery Image</Label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder="batteries"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity in Stock</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this battery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Battery Price
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/battery-prices")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
