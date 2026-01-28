import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>
          
          <LoginForm />
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Do not have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
