import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = getDatabase()

    const settings = await sql`
      SELECT * FROM commission_settings ORDER BY id DESC LIMIT 1
    `

    if (settings.length === 0) {
      return NextResponse.json({
        success: true,
        settings: {
          commissionRate: 10,
          paymentMethod: "",
          accountDetails: {
            accountName: "EventOR Platform",
          },
        },
      })
    }

    const setting = settings[0]
    return NextResponse.json({
      success: true,
      settings: {
        commissionRate: Number.parseFloat(setting.commission_rate) * 100,
        paymentMethod: setting.payment_method || "",
        accountDetails: {
          momoNumber: setting.payment_account_momo,
          momoNetwork: setting.momo_network,
          bankName: setting.bank_name,
          accountNumber: setting.payment_account_bank,
          accountName: setting.payment_account_name || "EventOR Platform",
        },
      },
    })
  } catch (error) {
    console.error("Get commission settings error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const body = await request.json()
    const { commissionRate, paymentMethod, accountDetails } = body

    // Validate commission rate
    if (!commissionRate || commissionRate < 0 || commissionRate > 50) {
      return NextResponse.json({ success: false, error: "Invalid commission rate" }, { status: 400 })
    }

    // Validate payment method
    if (!paymentMethod || !["mobile_money", "bank_account"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 })
    }

    // Validate account details
    if (!accountDetails?.accountName) {
      return NextResponse.json({ success: false, error: "Account name is required" }, { status: 400 })
    }

    if (paymentMethod === "mobile_money" && (!accountDetails.momoNumber || !accountDetails.momoNetwork)) {
      return NextResponse.json({ success: false, error: "Mobile money details are required" }, { status: 400 })
    }

    if (paymentMethod === "bank_account" && (!accountDetails.bankName || !accountDetails.accountNumber)) {
      return NextResponse.json({ success: false, error: "Bank account details are required" }, { status: 400 })
    }

    const sql = getDatabase()

    // Update or insert commission settings
    await sql`
      INSERT INTO commission_settings (
        commission_rate, 
        payment_method,
        payment_account_momo, 
        momo_network,
        bank_name,
        payment_account_bank, 
        payment_account_name
      )
      VALUES (
        ${commissionRate / 100}, 
        ${paymentMethod},
        ${accountDetails.momoNumber || null}, 
        ${accountDetails.momoNetwork || null},
        ${accountDetails.bankName || null},
        ${accountDetails.accountNumber || null}, 
        ${accountDetails.accountName}
      )
      ON CONFLICT (id) DO UPDATE SET
        commission_rate = EXCLUDED.commission_rate,
        payment_method = EXCLUDED.payment_method,
        payment_account_momo = EXCLUDED.payment_account_momo,
        momo_network = EXCLUDED.momo_network,
        bank_name = EXCLUDED.bank_name,
        payment_account_bank = EXCLUDED.payment_account_bank,
        payment_account_name = EXCLUDED.payment_account_name,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true, message: "Commission settings updated successfully" })
  } catch (error) {
    console.error("Update commission settings error:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
