import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get commission statistics
    const statsResult = await sql`
      SELECT 
        COUNT(*)::INTEGER as total_transactions,
        COALESCE(SUM(commission_amount), 0)::FLOAT as total_commission,
        COALESCE(SUM(amount), 0)::FLOAT as total_revenue,
        COALESCE(AVG(commission_rate), 0)::FLOAT as average_rate
      FROM payments 
      WHERE status = 'completed'
    `

    // Get monthly growth data
    const monthlyResult = await sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as transactions,
        SUM(commission_amount) as commission,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'completed'
        AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `

    // Get recent transactions
    const recentResult = await sql`
      SELECT 
        p.*,
        b.service_type,
        u.name as customer_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      WHERE p.status = 'completed'
      ORDER BY p.created_at DESC
      LIMIT 10
    `

    const stats = statsResult[0] || {
      total_transactions: 0,
      total_commission: 0,
      total_revenue: 0,
      average_rate: 0,
    }

    return NextResponse.json({
      ...stats,
      monthly_data: monthlyResult,
      recent_transactions: recentResult,
    })
  } catch (error) {
    console.error("Failed to fetch admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
