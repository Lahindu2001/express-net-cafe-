"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  variant?: "dropdown" | "button"
}

export function LogoutButton({ className, showIcon = false, variant = "dropdown" }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
      })

      if (res.ok) {
        setSuccess(true)
        
        // Show success message briefly before redirect
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      console.error("Logout failed:", error)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900 mb-2">
        <CheckCircle2 className="h-4 w-4 mt-0.5" />
        <AlertDescription>Logged out successfully! Redirecting...</AlertDescription>
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
