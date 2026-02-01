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
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: number
  name: string
  icon: string | null
}

interface AddAccessoryFormProps {
  categories: Category[]
}

export function AddAccessoryForm({ categories: initialCategories }: AddAccessoryFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  
  // Category form state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categoryError, setCategoryError] = useState("")
  const [categorySuccess, setCategorySuccess] = useState("")

  // Accessory form state
  const [selectedCategory, setSelectedCategory] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [compatibleModels, setCompatibleModels] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoryError("")
    setCategorySuccess("")
    setCategoryLoading(true)

    try {
      const res = await fetch("/api/admin/accessory-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, icon: newCategoryIcon }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add category")
      }

      setCategorySuccess("Category added successfully!")
      setCategories([...categories, { id: data.id, name: newCategoryName, icon: newCategoryIcon }])
      setNewCategoryName("")
      setNewCategoryIcon("")
      
      setTimeout(() => {
        setCategoryDialogOpen(false)
        setCategorySuccess("")
      }, 1500)
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Failed to add category")
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleAddAccessory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/accessories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: parseInt(selectedCategory),
          name,
          description: description || null,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
          image_url: imageUrl || null,
          compatible_models: compatibleModels || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add accessory")
      }

      setSuccess("Accessory added successfully! Redirecting...")
      
      setTimeout(() => {
        router.push("/admin/accessories")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add accessory")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            {categoryError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{categoryError}</AlertDescription>
              </Alert>
            )}
            
            {categorySuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{categorySuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Chargers"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-icon">Icon (Optional)</Label>
              <Input
                id="category-icon"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="Icon name or URL"
              />
            </div>

            <Button type="submit" className="w-full" disabled={categoryLoading}>
              {categoryLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Accessory Form */}
      <Card>
        <CardHeader>
          <CardTitle>Accessory Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAccessory} className="space-y-4">
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
                <Label htmlFor="category">Category *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCategoryDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Category
                </Button>
              </div>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Accessory Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., USB-C Fast Charger"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
                rows={3}
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
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Accessory Image (Optional)</Label>
              <ImageUpload
                folder="accessories"
                onUpload={setImageUrl}
                currentImage={imageUrl}
                label="Upload Accessory Image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compatible-models">Compatible Models (Optional)</Label>
              <Textarea
                id="compatible-models"
                value={compatibleModels}
                onChange={(e) => setCompatibleModels(e.target.value)}
                placeholder="e.g., iPhone 15, Samsung Galaxy S24"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/accessories")}
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
                  "Add Accessory"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
