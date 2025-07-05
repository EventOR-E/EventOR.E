import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Initialize database connection
function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(process.env.DATABASE_URL)
}

export async function POST(request: NextRequest) {
  try {
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

    // Get auth token from cookie
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please log in to book services.",
        },
        { status: 401 },
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    const { providerId, serviceId, eventDate, eventTime, location, guestCount, specialRequirements, totalAmount } = body

    // Validate required fields
    if (!providerId || !serviceId || !eventDate || !eventTime || !location || !guestCount || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields. Please fill in all required information.",
        },
        { status: 400 },
      )
    }

    // Validate amounts
    if (totalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount specified",
        },
        { status: 400 },
      )
    }

    // For now, simulate successful booking creation since we need to set up the database first
    const mockBooking = {
      id: Math.floor(Math.random() * 1000) + 1,
      providerId,
      serviceId,
      eventDate,
      eventTime,
      location,
      guestCount,
      totalAmount,
      specialRequirements,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      booking: mockBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An internal error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
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

    // Get auth token from cookie
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

    // For now, return mock bookings
    const mockBookings = [
      {
        id: 1,
        providerId: 1,
        serviceId: 1,
        eventDate: "2025-02-15",
        eventTime: "14:00",
        location: "Accra, Ghana",
        guestCount: 100,
        totalAmount: 2500,
        status: "confirmed",
        createdAt: "2025-01-05T10:00:00Z",
      },
    ]

    return NextResponse.json({
      success: true,
      bookings: mockBookings,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 },
    )
  }
}
