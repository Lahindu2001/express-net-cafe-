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
import { MoreHorizontal, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface SimCardActionsProps {
  id: number
  type: string
  price: number
  quantity: number
  description?: string
}

export function SimCardActions({ id, type, price, quantity, description }: SimCardActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // Edit form state
  const [editType, setEditType] = useState(type)
  const [editPrice, setEditPrice] = useState(price.toString())
  const [editQuantity, setEditQuantity] = useState(quantity.toString())
  const [editDescription, setEditDescription] = useState(description || "")
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")
    setEditSuccess("")
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/sim-cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editType,
          price: parseFloat(editPrice),
          quantity: parseInt(editQuantity) || 0,
          description: editDescription || null,
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
      setEditError("Failed to update SIM card")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this SIM card?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/sim-cards/${id}`, {
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
            <DialogTitle>Edit SIM Card</DialogTitle>
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
              <Label htmlFor="edit-type">Type *</Label>
              <Input
                id="edit-type"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
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
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
