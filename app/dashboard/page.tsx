"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  MessageCircle,
  TrendingUp,
  Users,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Heart,
  Loader2,
  Plus,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { verifyToken, getUserById } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  userType: "seeker" | "provider"
  avatarUrl?: string
  emailVerified: boolean
}

interface ProviderProfile {
  id: number
  businessName: string
  category: string
  description?: string
  locationCity: string
  locationRegion: string
  rating: number
  reviewCount: number
  verified: boolean
  profileImageUrl?: string
}

interface Booking {
  id: number
  clientName?: string
  providerName?: string
  serviceName: string
  eventDate: string
  eventTime: string
  location: string
  guestCount: number
  totalAmount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
  clientAvatar?: string
}

interface Message {
  id: number
  fromName: string
  message: string
  createdAt: string
  isRead: boolean
  fromAvatar?: string
}

interface DashboardStats {
  totalEarnings?: number
  activeBookings: number
  profileViews?: number
  responseRate?: number
  totalBookings?: number
  savedProviders?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Get auth token from cookie
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth-token\s*=\s*([^;]*).*$)|^.*$/, "$1")
      if (!token) {
        router.push("/login")
        return
      }

      // Verify token
      const decoded = verifyToken(token)
      if (!decoded) {
        router.push("/login")
        return
      }

      // Fetch user data
      const dbUser = await getUserById(decoded.userId)
      if (!dbUser) {
        router.push("/login")
        return
      }

      setUser(dbUser)

      // Fetch dashboard data based on user type
      if (dbUser.userType === "provider") {
        await fetchProviderData(dbUser.id)
      } else {
        await fetchSeekerData(dbUser.id)
      }
    } catch (err) {
      console.error("Dashboard error:", err)
      setError("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const fetchProviderData = async (userId: number) => {
    try {
      const sql = getDatabase()

      // Fetch provider profile
      const [profile] = await sql<ProviderProfile[]>`
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
      setProviderProfile(profile || null)

      // Fetch provider bookings
      const bookings = await sql<Booking[]>`
        SELECT 
          b.id, 
          b.event_date, 
          b.event_time, 
          b.location, 
          b.guest_count, 
          b.total_amount, 
          b.status, 
          b.created_at,
          u.first_name as client_first_name,
          u.last_name as client_last_name,
          ps.service_name
        FROM bookings b
        JOIN users u ON b.seeker_id = u.id
        LEFT JOIN provider_services ps ON b.service_id = ps.id
        WHERE b.provider_id = ${userId}
        ORDER BY b.created_at DESC
      `
      setBookings(bookings || [])

      // Calculate stats
      const totalEarnings =
        bookings
          ?.filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + Number.parseFloat(b.totalAmount.toString()), 0) || 0

      const activeBookings = bookings?.filter((b) => ["pending", "confirmed"].includes(b.status)).length || 0

      // Fetch messages
      const messages = await sql<Message[]>`
        SELECT 
          m.id, 
          m.message, 
          m.created_at, 
          u.first_name as from_name, 
          u.avatar_url as from_avatar,
          m.is_read
        FROM messages m
        JOIN users u ON m.from_id = u.id
        WHERE m.to_id = ${userId}
        ORDER BY m.created_at DESC
        LIMIT 5
      `
      setMessages(messages || [])

      setStats({
        totalEarnings,
        activeBookings,
        profileViews: Math.floor(Math.random() * 500) + 100, // Mock data
        responseRate: 95, // Mock data
      })
    } catch (err) {
      console.error("Provider data error:", err)
      setError("Failed to load provider data")
    }
  }

  const fetchSeekerData = async (userId: number) => {
    try {
      const sql = getDatabase()

      // Fetch seeker bookings
      const bookings = await sql<Booking[]>`
        SELECT 
          b.id, 
          b.event_date, 
          b.event_time, 
          b.location, 
          b.guest_count, 
          b.total_amount, 
          b.status, 
          b.created_at,
          pp.business_name as provider_name,
          ps.service_name
        FROM bookings b
        JOIN provider_profiles pp ON b.provider_id = pp.user_id
        LEFT JOIN provider_services ps ON b.service_id = ps.id
        WHERE b.seeker_id = ${userId}
        ORDER BY b.created_at DESC
      `
      setBookings(bookings || [])

      const activeBookings = bookings?.filter((b) => ["pending", "confirmed"].includes(b.status)).length || 0

      // Fetch saved providers
      const savedProviders = await sql`
        SELECT COUNT(*) FROM saved_providers WHERE seeker_id = ${userId}
      `
      const savedProvidersCount = savedProviders[0]?.count || 0

      setStats({
        activeBookings,
        totalBookings: bookings?.length || 0,
        savedProviders: savedProvidersCount,
      })
    } catch (err) {
      console.error("Seeker data error:", err)
      setError("Failed to load seeker data")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "completed":
        return "bg-blue-500 text-white"
      case "cancelled":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>User not found. Please log in again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-gray-600 hover:text-purple-600">
              Browse Services
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-purple-600">
              Messages
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-purple-600">
              Profile
            </Link>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.firstName}</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">
            {user.userType === "provider"
              ? "Manage your bookings, track earnings, and grow your business"
              : "Track your bookings, discover new providers, and plan your events"}
          </p>
          {providerProfile && (
            <div className="mt-4 flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {providerProfile.category}
              </Badge>
              <span className="text-sm text-gray-600">
                {providerProfile.locationCity}, {providerProfile.locationRegion}
              </span>
              {providerProfile.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          )}
        </div>

        {user.userType === "provider" ? (
          // Provider Dashboard
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold">GHC {(stats.totalEarnings || 0).toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                      <p className="text-2xl font-bold">{stats.activeBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-2xl font-bold">{stats.profileViews || 0}</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold">{stats.responseRate || 0}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your latest booking requests and confirmations</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <Button variant="outline" asChild>
                        <Link href="/profile/settings">Complete Your Profile</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.clientAvatar || "/placeholder.svg"} alt={booking.clientName} />
                              <AvatarFallback>{booking.clientName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{booking.clientName || "Client"}</p>
                              <p className="text-sm text-gray-600">{booking.serviceName}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(booking.eventDate)} at {formatTime(booking.eventTime)}
                              </p>
                              <p className="text-sm text-gray-500">{booking.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">GHC {booking.totalAmount.toLocaleString()}</p>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{booking.guestCount} guests</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {bookings.length > 3 && (
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Bookings ({bookings.length})
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest messages from potential clients</CardDescription>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No messages yet</p>
                      <Button variant="outline" asChild>
                        <Link href="/messages">Go to Messages</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={message.fromAvatar || "/placeholder.svg"} alt={message.fromName} />
                            <AvatarFallback>{message.fromName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold">{message.fromName}</p>
                              <span className="text-sm text-gray-500">{getTimeAgo(message.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{message.message}</p>
                            {!message.isRead && (
                              <Badge variant="secondary" className="mt-2">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/messages">View All Messages</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your business performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-gray-600">{providerProfile ? "85%" : "25%"}</span>
                    </div>
                    <Progress value={providerProfile ? 85 : 25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm text-gray-600">
                        {providerProfile?.rating ? `${providerProfile.rating}/5` : "No reviews yet"}
                      </span>
                    </div>
                    <Progress
                      value={providerProfile?.rating ? (providerProfile.rating / 5) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Response Rate</span>
                      <span className="text-sm text-gray-600">{stats.responseRate || 0}%</span>
                    </div>
                    <Progress value={stats.responseRate || 0} className="h-2" />
                  </div>
                </div>
                {!providerProfile && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Complete Your Profile</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Complete your provider profile to start receiving bookings and improve your visibility.
                    </p>
                    <Button size="sm" asChild>
                      <Link href="/profile/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Complete Profile
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Seeker Dashboard
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                      <p className="text-2xl font-bold">{stats.activeBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold">{stats.totalBookings}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saved Providers</p>
                      <p className="text-2xl font-bold">{stats.savedProviders}</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Active Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>Your upcoming and recent event bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <Button asChild>
                        <Link href="/browse">
                          <Plus className="h-4 w-4 mr-2" />
                          Find Providers
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{booking.providerName || "Provider"}</p>
                            <p className="text-sm text-gray-600">{booking.serviceName}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(booking.eventDate)} at {formatTime(booking.eventTime)}
                            </p>
                            <p className="text-sm text-gray-500">{booking.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">GHC {booking.totalAmount.toLocaleString()}</p>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{booking.guestCount} guests</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {bookings.length > 3 && (
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Bookings ({bookings.length})
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to help you plan your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Button className="h-16 flex items-center justify-start gap-4" asChild>
                      <Link href="/browse">
                        <Users className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">Find Providers</div>
                          <div className="text-sm opacity-90">Browse event service providers</div>
                        </div>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex items-center justify-start gap-4 bg-transparent"
                      asChild
                    >
                      <Link href="/messages">
                        <MessageCircle className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">View Messages</div>
                          <div className="text-sm opacity-70">Chat with providers</div>
                        </div>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex items-center justify-start gap-4 bg-transparent"
                      asChild
                    >
                      <Link href="/profile">
                        <Settings className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">My Profile</div>
                          <div className="text-sm opacity-70">Update your information</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions on EventOR</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    <p className="text-sm text-gray-400">Start by browsing providers and making your first booking</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 p-3 border-l-4 border-purple-200 bg-purple-50 rounded-r-lg"
                      >
                        <div className="flex-shrink-0">{getStatusIcon(booking.status)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Booking {booking.status} - {booking.serviceName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {getTimeAgo(booking.createdAt)} • {booking.providerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">GHC {booking.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
