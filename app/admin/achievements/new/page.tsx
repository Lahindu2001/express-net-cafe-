"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Award } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

export default function NewAchievementPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          year: parseInt(year),
          image_url: imageUrl,
        }),
      })

      if (res.ok) {
        router.push("/admin/achievements")
        router.refresh()
      } else {
        alert("Failed to add achievement")
      }
    } catch (error) {
      console.error("Error adding achievement:", error)
      alert("Failed to add achievement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/admin/achievements">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Achievements
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Add New Achievement</CardTitle>
              <CardDescription>Add a new achievement or award to showcase</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Best Service Award 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the achievement or award..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Achievement Image</Label>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="achievements"
              />
              <p className="text-sm text-muted-foreground">
                Upload an image of the certificate, trophy, or award
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Achievement"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
