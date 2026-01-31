"use client"

import React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DisplayPriceSearchProps {
  initialQuery?: string
}

export function DisplayPriceSearch({ initialQuery = "" }: DisplayPriceSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/display-repair?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/display-repair')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
      <Input
        type="search"
        placeholder="Search phone model (e.g., iPhone 14, Galaxy S23)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}
