import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"

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
    const providerId = searchParams.get("providerId")
    const seekerId = searchParams.get("seekerId")

    const sql = getDatabase()

    let bookings = []

    if (providerId) {
      // Get bookings for provider
      bookings = await sql`
        SELECT 
          b.*,
          u.first_name as client_first_name,
          u.last_name as client_last_name,
          u.avatar_url as client_avatar,
          ps.service_name,
          ps.base_price
        FROM bookings b
        JOIN users u ON b.seeker_id = u.id
        LEFT JOIN provider_services ps ON b.service_id = ps.id
        WHERE b.provider_id = ${Number.parseInt(providerId)}
        ORDER BY b.created_at DESC
      `
    } else if (seekerId) {
      // Get bookings for seeker
      bookings = await sql`
        SELECT 
          b.*,
          pp.business_name as provider_name,
          ps.service_name,
          ps.base_price
        FROM bookings b
        JOIN provider_profiles pp ON b.provider_id = pp.user_id
        LEFT JOIN provider_services ps ON b.service_id = ps.id
        WHERE b.seeker_id = ${Number.parseInt(seekerId)}
        ORDER BY b.created_at DESC
      `
    } else {
      return NextResponse.json({ success: false, error: "Provider ID or Seeker ID required" }, { status: 400 })
    }

    const formattedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      clientName: booking.client_first_name ? `${booking.client_first_name} ${booking.client_last_name}` : undefined,
      providerName: booking.provider_name,
      serviceName: booking.service_name || "Service",
      eventDate: booking.event_date,
      eventTime: booking.event_time,
      location: booking.location,
      guestCount: booking.guest_count,
      totalAmount: Number.parseFloat(booking.total_amount),
      status: booking.status,
      createdAt: booking.created_at,
      clientAvatar: booking.client_avatar,
    }))

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { providerId, serviceId, eventDate, eventTime, location, guestCount, specialRequirements, totalAmount } = body

    // Validate required fields
    if (!providerId || !eventDate || !eventTime || !location || !guestCount || !totalAmount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const sql = getDatabase()

    // Create booking
    const newBooking = await sql`
      INSERT INTO bookings (
        seeker_id, 
        provider_id, 
        service_id, 
        event_date, 
        event_time, 
        location, 
        guest_count, 
        special_requirements, 
        total_amount, 
        status
      )
      VALUES (
        ${decoded.userId}, 
        ${providerId}, 
        ${serviceId || null}, 
        ${eventDate}, 
        ${eventTime}, 
        ${location}, 
        ${guestCount}, 
        ${specialRequirements || null}, 
        ${totalAmount}, 
        'pending'
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      booking: {
        id: newBooking[0].id,
        status: newBooking[0].status,
        totalAmount: Number.parseFloat(newBooking[0].total_amount),
      },
    })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
