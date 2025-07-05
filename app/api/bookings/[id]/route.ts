import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify token
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

    const bookingId = Number.parseInt(params.id)
    if (isNaN(bookingId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking ID",
        },
        { status: 400 },
      )
    }

    // Mock booking data for demo
    const mockBooking = {
      id: bookingId,
      providerId: 1,
      serviceId: 1,
      eventDate: "2025-02-15",
      eventTime: "14:00",
      location: "Accra, Ghana",
      guestCount: 100,
      totalAmount: 2500,
      status: "pending",
      specialRequirements: "Please include traditional decorations",
      providerName: "Sarah's Perfect Events",
      serviceName: "Complete Wedding Planning",
      createdAt: "2025-01-05T10:00:00Z",
    }

    return NextResponse.json({
      success: true,
      booking: mockBooking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking details",
      },
      { status: 500 },
    )
  }
}
