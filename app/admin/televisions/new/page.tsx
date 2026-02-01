"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function NewTelevisionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/televisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price) || 0,
          quantity: parseInt(quantity) || 0,
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add television")
      }

      setSuccess("Television added successfully!")
      setTimeout(() => {
        router.push("/admin/televisions")
        router.refresh()
      }, 1000)
    } catch (error) {
      setError("Failed to add television. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/televisions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Televisions
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Television</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="name">Television Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Samsung 55 inch Smart TV"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Television description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity in Stock</Label>
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
              <Label>Television Image</Label>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="televisions"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Television"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
