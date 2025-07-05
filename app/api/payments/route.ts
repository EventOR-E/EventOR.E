import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

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
          error: "Authentication required. Please log in to make payments.",
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
          error: "Invalid authentication token.",
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

    const { bookingId, paymentMethod, amount, phoneNumber, cardDetails } = body

    // Validate required fields
    if (!bookingId || !paymentMethod || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment information",
        },
        { status: 400 },
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment amount",
        },
        { status: 400 },
      )
    }

    // Validate payment method specific data
    if (paymentMethod.includes("mobile_money") && !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required for mobile money payments",
        },
        { status: 400 },
      )
    }

    if (paymentMethod.includes("card") && (!cardDetails || !cardDetails.number || !cardDetails.cvv)) {
      return NextResponse.json(
        {
          success: false,
          error: "Card details are required for card payments",
        },
        { status: 400 },
      )
    }

    // Simulate payment processing (90% success rate for demo)
    const isSuccess = Math.random() > 0.1

    if (!isSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment was declined. Please check your payment details and try again.",
        },
        { status: 400 },
      )
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Mock successful payment response
    const mockPayment = {
      id: Math.floor(Math.random() * 1000) + 1,
      bookingId,
      amount,
      currency: "GHS",
      paymentMethod,
      status: "completed",
      transactionId,
      paymentDate: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      payment: mockPayment,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An internal error occurred during payment processing. Please try again.",
      },
      { status: 500 },
    )
  }
}
