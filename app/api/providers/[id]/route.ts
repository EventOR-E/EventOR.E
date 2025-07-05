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

    const userId = Number.parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 },
      )
    }

    const sql = getDatabase()

    const [provider] = await sql`
      SELECT 
        id, 
        business_name, 
        category, 
        description, 
        location_city, 
        location_region, 
        rating, 
        total_reviews as reviewCount, 
        verified
      FROM provider_profiles
      WHERE user_id = ${userId}
    `

    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      provider: {
        id: provider.id,
        businessName: provider.business_name,
        category: provider.category,
        description: provider.description,
        locationCity: provider.location_city,
        locationRegion: provider.location_region,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        verified: provider.verified,
      },
    })
  } catch (error) {
    console.error("Get provider error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch provider details",
      },
      { status: 500 },
    )
  }
}
