import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = getDatabase()

    // Get commission stats
    const commissionStats = await sql`
      SELECT 
        COALESCE(SUM(commission_amount), 0) as total_commissions,
        COALESCE(SUM(CASE WHEN commission_status = 'pending' THEN commission_amount ELSE 0 END), 0) as pending_commissions,
        COALESCE(SUM(CASE WHEN commission_status = 'paid' THEN commission_amount ELSE 0 END), 0) as paid_commissions,
        COUNT(*) as total_bookings
      FROM bookings 
      WHERE commission_amount IS NOT NULL
    `

    const stats = commissionStats[0] || {
      total_commissions: 0,
      pending_commissions: 0,
      paid_commissions: 0,
      total_bookings: 0,
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalCommissions: Number.parseFloat(stats.total_commissions) || 0,
        pendingCommissions: Number.parseFloat(stats.pending_commissions) || 0,
        paidCommissions: Number.parseFloat(stats.paid_commissions) || 0,
        totalBookings: Number.parseInt(stats.total_bookings) || 0,
      },
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
