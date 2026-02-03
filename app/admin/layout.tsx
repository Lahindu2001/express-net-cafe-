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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto w-full lg:ml-0">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
