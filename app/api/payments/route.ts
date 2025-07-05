import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { processPayment } from "@/lib/payments"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, paymentMethod, paymentDetails } = await request.json()

    // Validate input
    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json({ error: "Missing required payment information" }, { status: 400 })
    }

    // Get current commission settings
    const commissionResult = await sql`
      SELECT rate FROM commission_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    const commissionRate = commissionResult[0]?.rate || 0.05
    const commissionAmount = amount * commissionRate
    const providerAmount = amount - commissionAmount

    // Process the payment
    const paymentResult = await processPayment({
      amount,
      paymentMethod,
      paymentDetails,
    })

    if (!paymentResult.success) {
      return NextResponse.json({ error: paymentResult.error }, { status: 400 })
    }

    // Create payment record
    const payment = await sql`
      INSERT INTO payments (
        booking_id, amount, payment_method, status, transaction_id,
        commission_rate, commission_amount, provider_amount, created_at
      )
      VALUES (
        ${bookingId}, ${amount}, ${paymentMethod}, 'completed', 
        ${paymentResult.transactionId}, ${commissionRate}, 
        ${commissionAmount}, ${providerAmount}, NOW()
      )
      RETURNING *
    `

    // Update booking status
    await sql`
      UPDATE bookings 
      SET status = 'confirmed', updated_at = NOW()
      WHERE id = ${bookingId}
    `

    return NextResponse.json({
      success: true,
      payment: payment[0],
      commission: {
        rate: commissionRate,
        amount: commissionAmount,
        providerAmount,
      },
    })
  } catch (error) {
    console.error("Payment processing failed:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        p.*,
        b.service_type,
        b.event_date,
        u.name as customer_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (userId) {
      query += ` AND (b.user_id = $${paramIndex} OR b.provider_id = $${paramIndex})`
      params.push(Number.parseInt(userId))
      paramIndex++
    }

    if (status) {
      query += ` AND p.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC`

    const result = await sql(query, params)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to fetch payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
