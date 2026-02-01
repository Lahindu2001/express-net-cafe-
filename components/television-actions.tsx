"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoreHorizontal, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface TelevisionActionsProps {
  id: number
  name: string
  description: string | null
  price: number
  quantity: number
  imageUrl: string | null
}

export function TelevisionActions({ id, name, description, price, quantity, imageUrl }: TelevisionActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  const [editName, setEditName] = useState(name)
  const [editDescription, setEditDescription] = useState(description || "")
  const [editPrice, setEditPrice] = useState(price.toString())
  const [editQuantity, setEditQuantity] = useState(quantity.toString())
  const [editImageUrl, setEditImageUrl] = useState(imageUrl || "")

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")
    setEditSuccess("")
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/televisions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          price: parseFloat(editPrice) || 0,
          quantity: parseInt(editQuantity) || 0,
          image_url: editImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Update failed")
      }

      setEditSuccess("Updated successfully!")
      setTimeout(() => {
        setEditOpen(false)
        router.refresh()
      }, 1000)
    } catch (error) {
      setEditError("Failed to update television")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this television?")) return

    setLoading(true)
    try {
      await fetch(`/api/admin/televisions/${id}`, {
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
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Television</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {editError && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{editError}</AlertDescription>
              </Alert>
            )}

            {editSuccess && (
              <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
                <AlertDescription>{editSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Television Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (Rs.) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
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
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Television Image</Label>
              <ImageUpload
                value={editImageUrl}
                onChange={setEditImageUrl}
                folder="televisions"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
