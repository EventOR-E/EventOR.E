import { neon } from "@neondatabase/serverless"

// Create a function to get the database connection
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(databaseUrl)
}

export interface PaymentMethod {
  id: string
  name: string
  type: "mobile_money" | "card"
  icon: string
  networks?: string[]
}

export interface BookingData {
  providerId: number
  serviceId: number
  eventDate: string
  eventTime: string
  location: string
  guestCount: number
  specialRequirements?: string
  totalAmount: number
}

export interface PaymentData {
  bookingId: number
  paymentMethod: string
  amount: number
  phoneNumber?: string
  cardDetails?: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    name: string
  }
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "mtn_mobile_money",
    name: "MTN Mobile Money",
    type: "mobile_money",
    icon: "📱",
    networks: ["MTN"],
  },
  {
    id: "vodafone_cash",
    name: "Vodafone Cash",
    type: "mobile_money",
    icon: "📱",
    networks: ["Vodafone"],
  },
  {
    id: "airteltigo_money",
    name: "AirtelTigo Money",
    type: "mobile_money",
    icon: "📱",
    networks: ["AirtelTigo"],
  },
  {
    id: "visa_card",
    name: "Visa Card",
    type: "card",
    icon: "💳",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    type: "card",
    icon: "💳",
  },
]

export async function createBooking(bookingData: BookingData, userId: number) {
  try {
    const sql = getDatabase()

    const booking = await sql`
      INSERT INTO bookings (
        user_id, provider_id, service_id, event_date, event_time, 
        location, guest_count, special_requirements, total_amount, status
      )
      VALUES (
        ${userId}, ${bookingData.providerId}, ${bookingData.serviceId}, 
        ${bookingData.eventDate}, ${bookingData.eventTime}, ${bookingData.location}, 
        ${bookingData.guestCount}, ${bookingData.specialRequirements || null}, 
        ${bookingData.totalAmount}, 'pending'
      )
      RETURNING *
    `

    return { success: true, booking: booking[0] }
  } catch (error) {
    console.error("Create booking error:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

export async function processPayment(paymentData: PaymentData) {
  try {
    const sql = getDatabase()

    // Simulate payment processing
    const isSuccess = Math.random() > 0.1 // 90% success rate for demo

    if (!isSuccess) {
      return { success: false, error: "Payment failed. Please try again." }
    }

    // Create payment record
    const payment = await sql`
      INSERT INTO payments (
        booking_id, amount, payment_method, status, transaction_id
      )
      VALUES (
        ${paymentData.bookingId}, ${paymentData.amount}, 
        ${paymentData.paymentMethod}, 'completed', 
        ${`TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}
      )
      RETURNING *
    `

    // Update booking status
    await sql`
      UPDATE bookings 
      SET status = 'confirmed', payment_status = 'paid'
      WHERE id = ${paymentData.bookingId}
    `

    return { success: true, payment: payment[0] }
  } catch (error) {
    console.error("Process payment error:", error)
    return { success: false, error: "Payment processing failed" }
  }
}

export async function getBookingById(bookingId: number) {
  try {
    const sql = getDatabase()

    const bookings = await sql`
      SELECT b.*, pp.business_name, pp.category, u.first_name, u.last_name
      FROM bookings b
      JOIN provider_profiles pp ON b.provider_id = pp.user_id
      JOIN users u ON pp.user_id = u.id
      WHERE b.id = ${bookingId}
    `

    if (bookings.length === 0) {
      return null
    }

    return bookings[0]
  } catch (error) {
    console.error("Get booking error:", error)
    return null
  }
}
