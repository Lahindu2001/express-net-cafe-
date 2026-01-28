"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2 } from "lucide-react"

interface ReviewActionsProps {
  id: number
  isApproved: boolean
}

export function ReviewActions({ id, isApproved }: ReviewActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error approving review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: false }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error rejecting review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting review:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!isApproved && (
        <Button size="sm" onClick={handleApprove} disabled={loading}>
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
      )}
      {isApproved && (
        <Button size="sm" variant="outline" onClick={handleReject} disabled={loading}>
          <X className="h-4 w-4 mr-1" />
          Unapprove
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
