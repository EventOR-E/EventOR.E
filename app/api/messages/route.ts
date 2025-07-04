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

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "Conversation ID required" }, { status: 400 })
    }

    // Verify user has access to this conversation
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} 
      AND (seeker_id = ${decoded.userId} OR provider_id = ${decoded.userId})
    `

    if (conversation.length === 0) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 })
    }

    const messages = await sql`
      SELECT 
        m.id,
        m.content,
        m.message_type,
        m.file_url,
        m.created_at,
        m.sender_id,
        u.first_name,
        u.last_name,
        u.avatar_url
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ${conversationId}
      ORDER BY m.created_at ASC
    `

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      sender: `${msg.first_name} ${msg.last_name}`,
      content: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: msg.sender_id === decoded.userId,
      avatar: msg.avatar_url || "/placeholder.svg?height=32&width=32",
      type: msg.message_type,
      fileUrl: msg.file_url,
    }))

    // Mark messages as read
    await sql`
      UPDATE messages 
      SET read_at = CURRENT_TIMESTAMP 
      WHERE conversation_id = ${conversationId} 
      AND sender_id != ${decoded.userId}
      AND read_at IS NULL
    `

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
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

    const { conversationId, content, messageType = "text", fileUrl } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json({ success: false, error: "Conversation ID and content required" }, { status: 400 })
    }

    // Verify user has access to this conversation
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} 
      AND (seeker_id = ${decoded.userId} OR provider_id = ${decoded.userId})
    `

    if (conversation.length === 0) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 })
    }

    // Insert message
    const newMessage = await sql`
      INSERT INTO messages (conversation_id, sender_id, content, message_type, file_url)
      VALUES (${conversationId}, ${decoded.userId}, ${content}, ${messageType}, ${fileUrl || null})
      RETURNING id, created_at
    `

    // Update conversation last message time
    await sql`
      UPDATE conversations 
      SET last_message_at = CURRENT_TIMESTAMP 
      WHERE id = ${conversationId}
    `

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage[0].id,
        content,
        time: new Date(newMessage[0].created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      },
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
