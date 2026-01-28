"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Star } from "lucide-react"

interface ReviewFormProps {
  userId?: number
  isLoggedIn: boolean
}

export function ReviewForm({ userId, isLoggedIn }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoggedIn || !userId) {
      setError("Please login to submit a review")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review")
      }

      setSuccess("Review submitted successfully! It will appear after admin approval.")
      setRating(5)
      setComment("")
      
      setTimeout(() => {
        setSuccess("")
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Please <a href="/login" className="text-primary hover:underline">login</a> to leave a review
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="flex items-start gap-2 border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with us..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
