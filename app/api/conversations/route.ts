import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const conversations = await sql`
      SELECT 
        c.id,
        c.seeker_id,
        c.provider_id,
        c.last_message_at,
        seeker.first_name as seeker_first_name,
        seeker.last_name as seeker_last_name,
        seeker.avatar_url as seeker_avatar,
        provider.first_name as provider_first_name,
        provider.last_name as provider_last_name,
        provider.avatar_url as provider_avatar,
        pp.business_name,
        pp.category,
        pp.verified,
        (
          SELECT content 
          FROM messages 
          WHERE conversation_id = c.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE conversation_id = c.id 
          AND sender_id != ${decoded.userId}
          AND read_at IS NULL
        ) as unread_count
      FROM conversations c
      JOIN users seeker ON c.seeker_id = seeker.id
      JOIN users provider ON c.provider_id = provider.id
      LEFT JOIN provider_profiles pp ON provider.id = pp.user_id
      WHERE c.seeker_id = ${decoded.userId} OR c.provider_id = ${decoded.userId}
      ORDER BY c.last_message_at DESC
    `

    const formattedConversations = conversations.map((conv) => {
      const isSeeker = conv.seeker_id === decoded.userId
      const otherUser = isSeeker
        ? {
            id: conv.provider_id,
            name: conv.business_name || `${conv.provider_first_name} ${conv.provider_last_name}`,
            avatar: conv.provider_avatar,
            type: "provider",
            category: conv.category,
            verified: conv.verified,
          }
        : {
            id: conv.seeker_id,
            name: `${conv.seeker_first_name} ${conv.seeker_last_name}`,
            avatar: conv.seeker_avatar,
            type: "client",
          }

      return {
        id: conv.id,
        ...otherUser,
        lastMessage: conv.last_message || "No messages yet",
        time: formatTimeAgo(conv.last_message_at),
        unread: Number.parseInt(conv.unread_count) || 0,
        online: Math.random() > 0.5, // Random for demo - implement real presence later
      }
    })

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const { providerId } = await request.json()

    // Check if conversation already exists
    const existingConversation = await sql`
      SELECT id FROM conversations 
      WHERE seeker_id = ${decoded.userId} AND provider_id = ${providerId}
    `

    if (existingConversation.length > 0) {
      return NextResponse.json({
        success: true,
        conversationId: existingConversation[0].id,
      })
    }

    // Create new conversation
    const newConversation = await sql`
      INSERT INTO conversations (seeker_id, provider_id)
      VALUES (${decoded.userId}, ${providerId})
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      conversationId: newConversation[0].id,
    })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create conversation" }, { status: 500 })
  }
}

function formatTimeAgo(date: string): string {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "now"
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
  return `${Math.floor(diffInMinutes / 1440)} days ago`
}
