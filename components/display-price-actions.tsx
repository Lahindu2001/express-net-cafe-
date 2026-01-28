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
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoreHorizontal, Pencil, Trash2, Plus, Minus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface DisplayPriceActionsProps {
  id: number
  quantity: number
  price: number
  displayType: string
  notes?: string
}

export function DisplayPriceActions({ id, quantity, price, displayType, notes }: DisplayPriceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // Edit form state
  const [editDisplayType, setEditDisplayType] = useState(displayType)
  const [editPrice, setEditPrice] = useState(price.toString())
  const [editQuantity, setEditQuantity] = useState(quantity.toString())
  const [editNotes, setEditNotes] = useState(notes || "")
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  const handleUpdateQuantity = async (newQuantity: number) => {
    setLoading(true)
    try {
      await fetch(`/api/admin/display-prices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Math.max(0, newQuantity) }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")
    setEditSuccess("")
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/display-prices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_type: editDisplayType,
          price: parseFloat(editPrice),
          quantity: parseInt(editQuantity) || 0,
          notes: editNotes || null,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update")
      }

      setEditSuccess("Updated successfully!")
      setTimeout(() => {
        setEditDialogOpen(false)
        router.refresh()
      }, 1000)
    } catch (error) {
      setEditError("Failed to update display price")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this price?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/display-prices/${id}`, {
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
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Display Price</DialogTitle>
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
              <Label htmlFor="edit-display-type">Display Type *</Label>
              <Input
                id="edit-display-type"
                value={editDisplayType}
                onChange={(e) => setEditDisplayType(e.target.value)}
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
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
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
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateQuantity(quantity + 1)}>
            <Plus className="h-4 w-4 mr-2" />
            Increase Quantity
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateQuantity(quantity - 1)} disabled={quantity === 0}>
            <Minus className="h-4 w-4 mr-2" />
            Decrease Quantity
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
