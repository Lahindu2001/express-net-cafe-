"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, ShieldOff, Trash2 } from "lucide-react"

interface UserActionsProps {
  id: number
  role: string
}

export function UserActions({ id, role }: UserActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggleRole = async () => {
    const newRole = role === "admin" ? "customer" : "admin"
    setLoading(true)
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    setLoading(true)
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleRole}>
          {role === "admin" ? (
            <>
              <ShieldOff className="h-4 w-4 mr-2" />
              Remove Admin
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Make Admin
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
