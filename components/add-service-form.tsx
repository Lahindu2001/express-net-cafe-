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

export function AddServiceForm() {
  const router = useRouter()
  
  // Service form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [priceUnit, setPriceUnit] = useState("per page")
  const [icon, setIcon] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          price: parseFloat(price),
          price_unit: priceUnit,
          icon: icon || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add service")
      }

      setSuccess("Service added successfully! Redirecting...")
      
      setTimeout(() => {
        router.push("/admin/services")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddService} className="space-y-4">
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
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Photocopy - B&W"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Service description..."
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
              <Label htmlFor="price-unit">Price Unit *</Label>
              <select
                id="price-unit"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="per page">per page</option>
                <option value="per sheet">per sheet</option>
                <option value="per document">per document</option>
                <option value="per hour">per hour</option>
                <option value="per item">per item</option>
                <option value="flat rate">flat rate</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name (Optional)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., copy, printer, layers"
            />
            <p className="text-xs text-muted-foreground">
              Icon name from Lucide React (e.g., copy, printer, layers, smartphone)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/services")}
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
                "Add Service"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
