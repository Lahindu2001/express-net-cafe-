import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function GET() {
  try {
    await destroySession()
    
    // Return JSON response instead of redirect
    const response = NextResponse.json({ 
      success: true,
      message: "Logged out successfully" 
    })
    
    // Clear all cookies
    response.cookies.set('session', '', { 
      maxAge: 0,
      path: '/',
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Logout failed" 
    }, { status: 500 })
  }
}
