import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(databaseUrl)
}

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Database not configured",
        },
        { status: 503 },
      )
    }

    // Get user ID from token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      )
    }

    const userId = decoded.userId

    const sql = getDatabase()

    // Fetch messages for the user
    const messages = await sql`
      SELECT 
        m.id, 
        m.message, 
        m.created_at, 
        u.first_name as from_name, 
        u.avatar_url as from_avatar,
        m.is_read
      FROM messages m
      JOIN users u ON m.from_id = u.id
      WHERE m.to_id = ${userId}
      ORDER BY m.created_at DESC
    `

    return NextResponse.json({
      success: true,
      messages: messages.map((message: any) => ({
        id: message.id,
        fromName: message.from_name,
        message: message.message,
        createdAt: message.created_at,
        isRead: message.is_read,
        fromAvatar: message.from_avatar,
      })),
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch messages",
      },
      { status: 500 },
    )
  }
}
