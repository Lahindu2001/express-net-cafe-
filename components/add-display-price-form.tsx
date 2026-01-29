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
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface AddDisplayPriceFormProps {
  brands: Brand[]
  models: Model[]
}

export function AddDisplayPriceForm({ brands: initialBrands, models: initialModels }: AddDisplayPriceFormProps) {
  const router = useRouter()
  const [brands, setBrands] = useState(initialBrands)
  const [models, setModels] = useState(initialModels)
  
  // Brand form state
  const [brandDialogOpen, setBrandDialogOpen] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandLogo, setNewBrandLogo] = useState("")
  const [brandLoading, setBrandLoading] = useState(false)
  const [brandError, setBrandError] = useState("")
  const [brandSuccess, setBrandSuccess] = useState("")

  // Model form state
  const [modelDialogOpen, setModelDialogOpen] = useState(false)
  const [selectedBrandForModel, setSelectedBrandForModel] = useState("")
  const [newModelName, setNewModelName] = useState("")
  const [newModelImage, setNewModelImage] = useState("")
  const [modelLoading, setModelLoading] = useState(false)
  const [modelError, setModelError] = useState("")
  const [modelSuccess, setModelSuccess] = useState("")

  // Display price form state
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [displayType, setDisplayType] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError] = useState("")
  const [priceSuccess, setPriceSuccess] = useState("")

  // Filter models by selected brand
  const filteredModels = selectedBrand
    ? models.filter((m) => m.brand_id === parseInt(selectedBrand))
    : []

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    setBrandError("")
    setBrandSuccess("")
    setBrandLoading(true)

    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrandName, logo_url: newBrandLogo }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add brand")
      }

      setBrandSuccess("Brand added successfully!")
      setBrands([...brands, { id: data.id, name: newBrandName }])
      setNewBrandName("")
      setNewBrandLogo("")
      
      setTimeout(() => {
        setBrandDialogOpen(false)
        setBrandSuccess("")
      }, 1500)
    } catch (err) {
      setBrandError(err instanceof Error ? err.message : "Failed to add brand")
    } finally {
      setBrandLoading(false)
    }
  }

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault()
    setModelError("")
    setModelSuccess("")
    setModelLoading(true)

    try {
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: parseInt(selectedBrandForModel),
          name: newModelName,
          image_url: newModelImage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add model")
      }

      const brandName = brands.find((b) => b.id === parseInt(selectedBrandForModel))?.name || ""
      
      setModelSuccess("Model added successfully!")
      setModels([
        ...models,
        {
          id: data.id,
          name: newModelName,
          brand_id: parseInt(selectedBrandForModel),
          brand_name: brandName,
        },
      ])
      setNewModelName("")
      setNewModelImage("")
      setSelectedBrandForModel("")
      
      setTimeout(() => {
        setModelDialogOpen(false)
        setModelSuccess("")
      }, 1500)
    } catch (err) {
      setModelError(err instanceof Error ? err.message : "Failed to add model")
    } finally {
      setModelLoading(false)
    }
  }

  const handleAddDisplayPrice = async (e: React.FormEvent) => {
    e.preventDefault()
    setPriceError("")
    setPriceSuccess("")
    setPriceLoading(true)

    try {
      const res = await fetch("/api/admin/display-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: parseInt(selectedModel),
          display_type: displayType,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
          notes: notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add display price")
      }

      setPriceSuccess("Display price added successfully! Redirecting...")
      
      setTimeout(() => {
        router.push("/admin/display-prices")
        router.refresh()
      }, 1500)
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : "Failed to add display price")
    } finally {
      setPriceLoading(false)
    }
  }

  return (
    <>
      {/* Add Brand Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Phone Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBrand} className="space-y-4">
            {brandError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{brandError}</AlertDescription>
              </Alert>
            )}
            
            {brandSuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{brandSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input
                id="brand-name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="e.g., Samsung"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Brand Logo (Optional)</Label>
              <ImageUpload
                folder="brands"
                onUpload={setNewBrandLogo}
                currentImage={newBrandLogo}
                label="Upload Brand Logo"
              />
            </div>

            <Button type="submit" className="w-full" disabled={brandLoading}>
              {brandLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Brand"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Model Dialog */}
      <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Phone Model</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddModel} className="space-y-4">
            {modelError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{modelError}</AlertDescription>
              </Alert>
            )}
            
            {modelSuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{modelSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="model-brand">Phone Brand *</Label>
              <select
                id="model-brand"
                value={selectedBrandForModel}
                onChange={(e) => setSelectedBrandForModel(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
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
              <Label htmlFor="model-name">Model Name *</Label>
              <Input
                id="model-name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="e.g., Galaxy S24 Ultra"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Model Image (Optional)</Label>
              <ImageUpload
                folder="phones"
                onUpload={setNewModelImage}
                currentImage={newModelImage}
                label="Upload Phone Image"
              />
            </div>

            <Button type="submit" className="w-full" disabled={modelLoading}>
              {modelLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Model"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Display Price Form */}
      <Card>
        <CardHeader>
          <CardTitle>Display Price Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDisplayPrice} className="space-y-4">
            {priceError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{priceError}</AlertDescription>
              </Alert>
            )}
            
            {priceSuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{priceSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone-brand">Phone Brand *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBrandDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Brand
                </Button>
              </div>
              <select
                id="phone-brand"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setSelectedModel("")
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="phone-model">Phone Model *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModelDialogOpen(true)}
                  disabled={!selectedBrand}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Model
                </Button>
              </div>
              <select
                id="phone-model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
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

            <div className="space-y-2">
              <Label htmlFor="display-type">Display Type *</Label>
              <Input
                id="display-type"
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value)}
                placeholder="e.g., Original, AAA, OLED"
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
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/display-prices")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={priceLoading}>
                {priceLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Display Price"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
