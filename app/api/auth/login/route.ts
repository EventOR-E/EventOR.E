import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Database not configured. Please set up your Neon database connection.",
        },
        { status: 503 },
      )
    }

    try {
      const result = await authenticateUser(email, password)

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || "Invalid email or password",
          },
          { status: 401 },
        )
      }

      // Set HTTP-only cookie with the token
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: "Login successful",
      })

      response.cookies.set("auth-token", result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return response
    } catch (dbError) {
      console.error("Database authentication error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Authentication service temporarily unavailable. Please try again.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
