import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

// Create a function to get the database connection
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(databaseUrl)
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  userType: "seeker" | "provider"
  avatarUrl?: string
  emailVerified: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number): string {
  const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
    return jwt.verify(token, jwtSecret) as { userId: number }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  userType: "seeker" | "provider"
  businessName?: string
}): Promise<AuthResult> {
  try {
    const sql = getDatabase()

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists with this email" }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password)

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type)
      VALUES (${userData.email}, ${passwordHash}, ${userData.firstName}, ${userData.lastName}, ${userData.phone || null}, ${userData.userType})
      RETURNING id, email, first_name, last_name, phone, user_type, avatar_url, email_verified
    `

    const user = newUser[0]

    // If provider, create provider profile
    if (userData.userType === "provider" && userData.businessName) {
      await sql`
        INSERT INTO provider_profiles (user_id, business_name, category, location_city, location_region)
        VALUES (${user.id}, ${userData.businessName}, 'General', 'Accra', 'Greater Accra')
      `
    }

    const token = generateToken(user.id)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        avatarUrl: user.avatar_url,
        emailVerified: user.email_verified,
      },
      token,
    }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const sql = getDatabase()

    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, phone, user_type, avatar_url, email_verified
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = users[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    const token = generateToken(user.id)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        avatarUrl: user.avatar_url,
        emailVerified: user.email_verified,
      },
      token,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const sql = getDatabase()

    const users = await sql`
      SELECT id, email, first_name, last_name, phone, user_type, avatar_url, email_verified
      FROM users 
      WHERE id = ${userId}
    `

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      userType: user.user_type,
      avatarUrl: user.avatar_url,
      emailVerified: user.email_verified,
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}
