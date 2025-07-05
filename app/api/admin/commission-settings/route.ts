import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM commission_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    const settings = result[0] || {
      rate: 0.05,
      payment_method: "mobile_money",
      account_details: "",
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch commission settings:", error)
    return NextResponse.json({ error: "Failed to fetch commission settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rate, paymentMethod, accountDetails } = await request.json()

    // Validate input
    if (typeof rate !== "number" || rate < 0 || rate > 0.5) {
      return NextResponse.json({ error: "Commission rate must be between 0% and 50%" }, { status: 400 })
    }

    if (!paymentMethod || !accountDetails) {
      return NextResponse.json({ error: "Payment method and account details are required" }, { status: 400 })
    }

    // Insert new commission settings
    const result = await sql`
      INSERT INTO commission_settings (rate, payment_method, account_details, created_at)
      VALUES (${rate}, ${paymentMethod}, ${accountDetails}, NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to save commission settings:", error)
    return NextResponse.json({ error: "Failed to save commission settings" }, { status: 500 })
  }
}
