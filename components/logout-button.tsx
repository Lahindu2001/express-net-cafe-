"use client"

import React from "react"
import { useState } from "react"
import { LogOut, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  variant?: "dropdown" | "button"
}

export function LogoutButton({ className, showIcon = false, variant = "dropdown" }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent any event bubbling
    if (e.currentTarget) {
      e.currentTarget.setAttribute('disabled', 'true')
    }
    
    setLoading(true)

    try {
      // Clear all storage immediately
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.clear()
          localStorage.clear()
        } catch (err) {
          console.error('Storage clear error:', err)
        }
      }

      // Simple logout request with minimal options
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        cache: 'no-store',
      })

      if (res.ok) {
        setSuccess(true)
        
        // Use simple redirect without any router
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            // Hard navigation without history
            window.location.replace("/")
          }
        }, 500)
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error("Logout failed:", error)
      // Even on error, redirect to home
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.replace("/")
        }
      }, 500)
    }
  }

  if (success) {
    return (
      <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900 mb-2">
        <CheckCircle2 className="h-4 w-4 mt-0.5" />
        <AlertDescription>Logged out successfully!</AlertDescription>
      </Alert>
    )
  }

  if (variant === "dropdown") {
    return (
      <div onClick={handleLogout} className={className} style={{ cursor: loading ? "wait" : "pointer" }}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
            Logging out...
          </>
        ) : (
          <>
            {showIcon && <LogOut className="h-4 w-4 mr-2 inline" />}
            Logout
          </>
        )}
      </div>
    )
  }

  return (
    <button onClick={handleLogout} className={className} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-1" />}
          Logout
        </>
      )}
    </button>
  )
}
