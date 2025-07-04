import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        pp.id,
        pp.business_name,
        pp.category,
        pp.bio,
        pp.location_city,
        pp.location_region,
        pp.years_experience,
        pp.hourly_rate,
        pp.daily_rate,
        pp.cover_image_url,
        pp.verified,
        pp.response_time_hours,
        u.first_name,
        u.last_name,
        u.avatar_url,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count,
        COUNT(DISTINCT b.id) as completed_jobs
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      LEFT JOIN reviews r ON pp.id = r.provider_id
      LEFT JOIN bookings b ON pp.user_id = b.provider_id AND b.status = 'completed'
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      query += ` AND LOWER(pp.category) = LOWER($${paramIndex})`
      params.push(category)
      paramIndex++
    }

    if (location && location !== "all") {
      query += ` AND (LOWER(pp.location_city) LIKE LOWER($${paramIndex}) OR LOWER(pp.location_region) LIKE LOWER($${paramIndex}))`
      params.push(`%${location}%`)
      paramIndex++
    }

    if (search) {
      query += ` AND (
        LOWER(pp.business_name) LIKE LOWER($${paramIndex}) OR 
        LOWER(pp.bio) LIKE LOWER($${paramIndex}) OR 
        LOWER(pp.category) LIKE LOWER($${paramIndex})
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += `
      GROUP BY pp.id, u.first_name, u.last_name, u.avatar_url
      ORDER BY pp.verified DESC, average_rating DESC, review_count DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const providers = await sql(query, params)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT pp.id) as total
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE 1=1
    `

    const countParams: any[] = []
    let countParamIndex = 1

    if (category && category !== "all") {
      countQuery += ` AND LOWER(pp.category) = LOWER($${countParamIndex})`
      countParams.push(category)
      countParamIndex++
    }

    if (location && location !== "all") {
      countQuery += ` AND (LOWER(pp.location_city) LIKE LOWER($${countParamIndex}) OR LOWER(pp.location_region) LIKE LOWER($${countParamIndex}))`
      countParams.push(`%${location}%`)
      countParamIndex++
    }

    if (search) {
      countQuery += ` AND (
        LOWER(pp.business_name) LIKE LOWER($${countParamIndex}) OR 
        LOWER(pp.bio) LIKE LOWER($${countParamIndex}) OR 
        LOWER(pp.category) LIKE LOWER($${countParamIndex})
      )`
      countParams.push(`%${search}%`)
    }

    const countResult = await sql(countQuery, countParams)
    const total = Number.parseInt(countResult[0].total)

    return NextResponse.json({
      success: true,
      data: {
        providers: providers.map((provider) => ({
          id: provider.id,
          name: provider.business_name,
          category: provider.category,
          rating: Number.parseFloat(provider.average_rating) || 0,
          reviewCount: Number.parseInt(provider.review_count) || 0,
          location: `${provider.location_city}, ${provider.location_region}`,
          price: provider.daily_rate
            ? `GHC ${provider.daily_rate}/day`
            : provider.hourly_rate
              ? `GHC ${provider.hourly_rate}/hour`
              : "Contact for pricing",
          image: provider.cover_image_url || "/placeholder.svg?height=200&width=300",
          verified: provider.verified,
          description: provider.bio,
          avatar: provider.avatar_url || "/placeholder.svg?height=40&width=40",
          completedJobs: Number.parseInt(provider.completed_jobs) || 0,
          responseTime: `${provider.response_time_hours} hours`,
          tags: [provider.category], // We can expand this later
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Get providers error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch providers" }, { status: 500 })
  }
}
