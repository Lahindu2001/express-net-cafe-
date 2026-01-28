import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupForm } from "@/components/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to leave reviews and track your repairs
            </p>
          </div>
          
          <SignupForm />
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
