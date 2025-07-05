import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database helper functions
export async function createUser(userData: {
  name: string
  email: string
  password: string
  type: "seeker" | "provider"
  phone?: string
  location?: string
}) {
  const result = await sql`
    INSERT INTO users (name, email, password, type, phone, location, created_at)
    VALUES (${userData.name}, ${userData.email}, ${userData.password}, ${userData.type}, ${userData.phone || null}, ${userData.location || null}, NOW())
    RETURNING id, name, email, type, phone, location, created_at
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result[0]
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, name, email, type, phone, location, avatar, verified, created_at
    FROM users WHERE id = ${id}
  `
  return result[0]
}

export async function getProviders(
  filters: {
    category?: string
    location?: string
    minPrice?: number
    maxPrice?: number
    verified?: boolean
    search?: string
  } = {},
) {
  let query = `
    SELECT 
      u.id, u.name, u.email, u.phone, u.location, u.avatar, u.verified,
      p.business_name, p.category, p.description, p.starting_price, p.price_range,
      p.response_time, p.completed_jobs, p.tags,
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(r.id) as review_count
    FROM users u
    JOIN providers p ON u.id = p.user_id
    LEFT JOIN reviews r ON p.id = r.provider_id
    WHERE u.type = 'provider'
  `

  const params: any[] = []
  let paramIndex = 1

  if (filters.category && filters.category !== "All Categories") {
    query += ` AND p.category = $${paramIndex}`
    params.push(filters.category)
    paramIndex++
  }

  if (filters.location && filters.location !== "All Locations") {
    query += ` AND u.location ILIKE $${paramIndex}`
    params.push(`%${filters.location}%`)
    paramIndex++
  }

  if (filters.minPrice) {
    query += ` AND p.starting_price >= $${paramIndex}`
    params.push(filters.minPrice)
    paramIndex++
  }

  if (filters.maxPrice) {
    query += ` AND p.starting_price <= $${paramIndex}`
    params.push(filters.maxPrice)
    paramIndex++
  }

  if (filters.verified) {
    query += ` AND u.verified = true`
  }

  if (filters.search) {
    query += ` AND (
      u.name ILIKE $${paramIndex} OR 
      p.business_name ILIKE $${paramIndex} OR 
      p.description ILIKE $${paramIndex} OR
      p.category ILIKE $${paramIndex}
    )`
    params.push(`%${filters.search}%`)
    paramIndex++
  }

  query += `
    GROUP BY u.id, p.id
    ORDER BY rating DESC, review_count DESC
  `

  const result = await sql(query, params)
  return result
}

export async function createBooking(bookingData: {
  userId: number
  providerId: number
  serviceType: string
  eventDate: string
  eventTime: string
  location: string
  guestCount: number
  budget: number
  description: string
  status?: string
}) {
  const result = await sql`
    INSERT INTO bookings (
      user_id, provider_id, service_type, event_date, event_time, 
      location, guest_count, budget, description, status, created_at
    )
    VALUES (
      ${bookingData.userId}, ${bookingData.providerId}, ${bookingData.serviceType},
      ${bookingData.eventDate}, ${bookingData.eventTime}, ${bookingData.location},
      ${bookingData.guestCount}, ${bookingData.budget}, ${bookingData.description},
      ${bookingData.status || "pending"}, NOW()
    )
    RETURNING *
  `
  return result[0]
}

export async function getBookingsByUserId(userId: number) {
  const result = await sql`
    SELECT 
      b.*,
      u.name as client_name,
      u.avatar as client_avatar,
      p.business_name as provider_business_name
    FROM bookings b
    LEFT JOIN users u ON (
      CASE 
        WHEN b.user_id = ${userId} THEN b.provider_id = u.id
        ELSE b.user_id = u.id
      END
    )
    LEFT JOIN providers p ON b.provider_id = p.user_id
    WHERE b.user_id = ${userId} OR b.provider_id = ${userId}
    ORDER BY b.created_at DESC
  `
  return result
}

export async function createConversation(userId: number, providerId: number) {
  // Check if conversation already exists
  const existing = await sql`
    SELECT * FROM conversations 
    WHERE (user_id = ${userId} AND provider_id = ${providerId})
    OR (user_id = ${providerId} AND provider_id = ${userId})
  `

  if (existing.length > 0) {
    return existing[0]
  }

  const result = await sql`
    INSERT INTO conversations (user_id, provider_id, created_at)
    VALUES (${userId}, ${providerId}, NOW())
    RETURNING *
  `
  return result[0]
}

export async function getConversationsByUserId(userId: number) {
  const result = await sql`
    SELECT 
      c.*,
      u.name as other_user_name,
      u.avatar as other_user_avatar,
      p.business_name,
      m.content as last_message,
      m.created_at as last_message_time
    FROM conversations c
    LEFT JOIN users u ON (
      CASE 
        WHEN c.user_id = ${userId} THEN c.provider_id = u.id
        ELSE c.user_id = u.id
      END
    )
    LEFT JOIN providers p ON (
      CASE 
        WHEN c.user_id = ${userId} THEN c.provider_id = p.user_id
        ELSE c.user_id = p.user_id
      END
    )
    LEFT JOIN messages m ON c.id = m.conversation_id
    WHERE c.user_id = ${userId} OR c.provider_id = ${userId}
    ORDER BY m.created_at DESC
  `
  return result
}

export async function createMessage(messageData: {
  conversationId: number
  senderId: number
  content: string
}) {
  const result = await sql`
    INSERT INTO messages (conversation_id, sender_id, content, created_at)
    VALUES (${messageData.conversationId}, ${messageData.senderId}, ${messageData.content}, NOW())
    RETURNING *
  `
  return result[0]
}

export async function getMessagesByConversationId(conversationId: number) {
  const result = await sql`
    SELECT 
      m.*,
      u.name as sender_name,
      u.avatar as sender_avatar
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ${conversationId}
    ORDER BY m.created_at ASC
  `
  return result
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const result = await sql`
    UPDATE bookings 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${bookingId}
    RETURNING *
  `
  return result[0]
}

export async function createPayment(paymentData: {
  bookingId: number
  amount: number
  paymentMethod: string
  status: string
  transactionId?: string
  commissionRate: number
  commissionAmount: number
  providerAmount: number
}) {
  const result = await sql`
    INSERT INTO payments (
      booking_id, amount, payment_method, status, transaction_id,
      commission_rate, commission_amount, provider_amount, created_at
    )
    VALUES (
      ${paymentData.bookingId}, ${paymentData.amount}, ${paymentData.paymentMethod},
      ${paymentData.status}, ${paymentData.transactionId || null},
      ${paymentData.commissionRate}, ${paymentData.commissionAmount}, 
      ${paymentData.providerAmount}, NOW()
    )
    RETURNING *
  `
  return result[0]
}

export async function getCommissionSettings() {
  const result = await sql`
    SELECT * FROM commission_settings ORDER BY created_at DESC LIMIT 1
  `
  return result[0] || { rate: 0.05, payment_method: "mobile_money" }
}

export async function updateCommissionSettings(settings: {
  rate: number
  paymentMethod: string
  accountDetails: string
}) {
  const result = await sql`
    INSERT INTO commission_settings (rate, payment_method, account_details, created_at)
    VALUES (${settings.rate}, ${settings.paymentMethod}, ${settings.accountDetails}, NOW())
    RETURNING *
  `
  return result[0]
}

export async function getCommissionStats() {
  const result = await sql`
    SELECT 
      COUNT(*) as total_transactions,
      SUM(commission_amount) as total_commission,
      SUM(amount) as total_revenue,
      AVG(commission_rate) as average_rate
    FROM payments 
    WHERE status = 'completed'
  `
  return result[0]
}
