import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSession } from "@/lib/auth"
import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default async function ProfilePage() {
  const user = await getSession()
  
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
