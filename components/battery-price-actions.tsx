"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"

interface BatteryPrice {
  id: number
  model_id: number
  brand_name: string
  model_name: string
  battery_type: string
  image_url: string | null
  price: number
  quantity: number
}

interface BatteryPriceActionsProps {
  batteryPrice: BatteryPrice
}

export function BatteryPriceActions({ batteryPrice }: BatteryPriceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  
  // Edit form state
  const [batteryType, setBatteryType] = useState(batteryPrice.battery_type)
  const [imageUrl, setImageUrl] = useState(batteryPrice.image_url || "")
  const [price, setPrice] = useState(batteryPrice.price.toString())
  const [quantity, setQuantity] = useState(batteryPrice.quantity.toString())

  const handleEdit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/battery-prices/${batteryPrice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: batteryPrice.model_id,
          battery_type: batteryType,
          image_url: imageUrl || null,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          notes: null,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update")
      }

      setEditOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating battery price:", error)
      alert("Failed to update battery price")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/battery-prices/${batteryPrice.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete")
      }

      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting battery price:", error)
      alert("Failed to delete battery price")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Battery Price</DialogTitle>
            <DialogDescription>
              Update battery price for {batteryPrice.brand_name} {batteryPrice.model_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batteryType">Battery Type</Label>
              <select
                id="batteryType"
                value={batteryType}
                onChange={(e) => setBatteryType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="Original">Original</option>
                <option value="Compatible">Compatible</option>
                <option value="High Capacity">High Capacity</option>
              </select>
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
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Battery Price</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the battery price for{" "}
              <strong>{batteryPrice.brand_name} {batteryPrice.model_name}</strong>{" "}
              ({batteryPrice.battery_type})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
