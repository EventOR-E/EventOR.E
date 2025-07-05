import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(databaseUrl)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const providerId = Number.parseInt(params.id)

    if (isNaN(providerId)) {
      return NextResponse.json({ success: false, error: "Invalid provider ID" }, { status: 400 })
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = getDatabase()

    // Get provider profile
    const providers = await sql`
      SELECT 
        pp.*,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar_url,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      LEFT JOIN reviews r ON pp.id = r.provider_id
      WHERE pp.user_id = ${providerId}
      GROUP BY pp.id, u.id
    `

    if (providers.length === 0) {
      return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 })
    }

    const provider = providers[0]

    return NextResponse.json({
      success: true,
      provider: {
        id: provider.id,
        businessName: provider.business_name,
        category: provider.category,
        description: provider.description,
        locationCity: provider.location_city,
        locationRegion: provider.location_region,
        rating: Number.parseFloat(provider.rating) || 0,
        reviewCount: Number.parseInt(provider.review_count) || 0,
        verified: provider.verified || false,
        profileImageUrl: provider.profile_image_url,
        firstName: provider.first_name,
        lastName: provider.last_name,
        email: provider.email,
        avatarUrl: provider.avatar_url,
      },
    })
  } catch (error) {
    console.error("Get provider error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
