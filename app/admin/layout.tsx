import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  
  if (!user) {
    redirect("/login")
  }
  
  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
