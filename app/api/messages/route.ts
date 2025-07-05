import { type NextRequest, NextResponse } from "next/server"
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
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const sql = getDatabase()

    // Get recent messages for user
    const messages = await sql`
      SELECT 
        m.*,
        u.first_name as from_first_name,
        u.last_name as from_last_name,
        u.avatar_url as from_avatar
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      JOIN users u ON m.sender_id = u.id
      WHERE (c.seeker_id = ${Number.parseInt(userId)} OR c.provider_id = ${Number.parseInt(userId)})
        AND m.sender_id != ${Number.parseInt(userId)}
      ORDER BY m.created_at DESC
      LIMIT 10
    `

    const formattedMessages = messages.map((message: any) => ({
      id: message.id,
      fromName: `${message.from_first_name} ${message.from_last_name}`,
      message: message.content,
      createdAt: message.created_at,
      isRead: message.is_read,
      fromAvatar: message.from_avatar,
    }))

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
