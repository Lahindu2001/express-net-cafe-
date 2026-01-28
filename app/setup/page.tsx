"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    error?: string
    accounts?: {
      admin: { email: string; password: string }
      user: { email: string; password: string }
    }
  } | null>(null)

  const runSetup = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/setup', { method: 'POST' })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Express Net Cafe Setup</CardTitle>
          <CardDescription>
            Click the button below to create test accounts and sample data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={runSetup} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              "Run Setup"
            )}
          </Button>

          {result?.success && result.accounts && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Setup Complete!</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Admin Account</h3>
                  <p className="text-sm"><strong>Email:</strong> {result.accounts.admin.email}</p>
                  <p className="text-sm"><strong>Password:</strong> {result.accounts.admin.password}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Customer Account</h3>
                  <p className="text-sm"><strong>Email:</strong> {result.accounts.user.email}</p>
                  <p className="text-sm"><strong>Password:</strong> {result.accounts.user.password}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href="/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{result.error}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            This will create admin and customer test accounts with sample products data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
