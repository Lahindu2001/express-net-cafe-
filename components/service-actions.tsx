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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface ServiceActionsProps {
  id: number
  name: string
  description: string | null
  price: string
  price_unit: string
  icon: string | null
}

export function ServiceActions({ id, name, description, price, price_unit, icon }: ServiceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Edit form state
  const [editName, setEditName] = useState(name)
  const [editDescription, setEditDescription] = useState(description || "")
  const [editPrice, setEditPrice] = useState(price)
  const [editPriceUnit, setEditPriceUnit] = useState(price_unit)
  const [editIcon, setEditIcon] = useState(icon || "")

  const handleEdit = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editName,
          description: editDescription || null,
          price: parseFloat(editPrice),
          price_unit: editPriceUnit,
          icon: editIcon || null,
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/services/${id}`, {
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
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Service Name *</Label>
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
                rows={3}
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
                <Label htmlFor="edit-price-unit">Price Unit *</Label>
                <select
                  id="edit-price-unit"
                  value={editPriceUnit}
                  onChange={(e) => setEditPriceUnit(e.target.value)}
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
              <Label htmlFor="edit-icon">Icon Name</Label>
              <Input
                id="edit-icon"
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                placeholder="e.g., copy, printer, layers"
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
