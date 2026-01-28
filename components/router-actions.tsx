"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { MoreHorizontal, Pencil, Trash2, Plus, Minus } from "lucide-react"

interface RouterActionsProps {
  id: number
  model: string
  price: string
  quantity: number
  description?: string
  features?: string
  image_url?: string
}

export function RouterActions({ 
  id, 
  model, 
  price, 
  quantity, 
  description, 
  features, 
  image_url 
}: RouterActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Edit form state
  const [editModel, setEditModel] = useState(model)
  const [editPrice, setEditPrice] = useState(price)
  const [editQuantity, setEditQuantity] = useState(quantity.toString())
  const [editDescription, setEditDescription] = useState(description || "")
  const [editFeatures, setEditFeatures] = useState(features || "")
  const [editImageUrl, setEditImageUrl] = useState(image_url || "")

  const handleEdit = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/routers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: editModel,
          price: parseFloat(editPrice),
          quantity: parseInt(editQuantity) || 0,
          description: editDescription || null,
          features: editFeatures || null,
          image_url: editImageUrl || null,
        }),
      })
      setShowEditDialog(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (delta: number) => {
    setLoading(true)
    try {
      await fetch(`/api/admin/routers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Math.max(0, quantity + delta) }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this router?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/routers/${id}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuantityChange(1)}>
            <Plus className="h-4 w-4 mr-2" />
            Increase Quantity
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuantityChange(-1)}>
            <Minus className="h-4 w-4 mr-2" />
            Decrease Quantity
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Router</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-model">Router Model *</Label>
              <Input
                id="edit-model"
                value={editModel}
                onChange={(e) => setEditModel(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (Rs.) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-features">Features</Label>
              <Textarea
                id="edit-features"
                value={editFeatures}
                onChange={(e) => setEditFeatures(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image-url">Image URL</Label>
              <Input
                id="edit-image-url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
