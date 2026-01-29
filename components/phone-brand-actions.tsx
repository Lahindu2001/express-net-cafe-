'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PhoneBrand } from '@/lib/types'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface PhoneBrandActionsProps {
  brand: PhoneBrand
}

export function PhoneBrandActions({ brand }: PhoneBrandActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/phone-brands/${brand.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete brand')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/brands/${brand.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phone Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{brand.name}"? This action cannot be undone.
              <div className="mt-2 text-sm text-gray-500">
                Note: You cannot delete a brand that has phone models associated with it.
              </div>
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
