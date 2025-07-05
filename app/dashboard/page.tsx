"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MobileNav } from "@/components/mobile-nav"
import {
  Calendar,
  Star,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  Plus,
  Filter,
  Download,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)

          // Fetch dashboard stats
          const statsResponse = await fetch("/api/dashboard/stats")
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats(statsData)
          }

          // Fetch recent bookings
          const bookingsResponse = await fetch("/api/bookings")
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json()
            setBookings(bookingsData.slice(0, 5)) // Get latest 5 bookings
          }

          // Fetch recent messages
          const messagesResponse = await fetch("/api/messages")
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            setMessages(messagesData.slice(0, 5)) // Get latest 5 messages
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock data for demonstration
  const mockStats = stats || {
    totalBookings: user.type === "provider" ? 45 : 12,
    totalEarnings: user.type === "provider" ? 15750 : 0,
    totalSpent: user.type === "seeker" ? 3200 : 0,
    averageRating: user.type === "provider" ? 4.8 : 0,
    responseRate: user.type === "provider" ? 95 : 0,
    profileViews: user.type === "provider" ? 234 : 0,
    activeBookings: 3,
    completedBookings: user.type === "provider" ? 42 : 9,
    pendingBookings: 2,
    monthlyGrowth: 12.5,
  }

  const mockBookings =
    bookings.length > 0
      ? bookings
      : [
          {
            id: 1,
            clientName: user.type === "provider" ? "Akosua Mensah" : "Kwame Photography",
            service: user.type === "provider" ? "Wedding Photography" : "Wedding Photography Service",
            date: "2025-01-15",
            status: "confirmed",
            amount: 1500,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 2,
            clientName: user.type === "provider" ? "Kofi Adjei" : "Ama's Catering",
            service: user.type === "provider" ? "Corporate Event" : "Corporate Catering",
            date: "2025-01-20",
            status: "pending",
            amount: 800,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 3,
            clientName: user.type === "provider" ? "Ama Osei" : "DJ Kobby",
            service: user.type === "provider" ? "Birthday Party" : "Birthday Party DJ",
            date: "2025-01-25",
            status: "completed",
            amount: 600,
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ]

  const mockMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: 1,
            senderName: "Akosua Mensah",
            lastMessage: "Hi, I'd like to book you for my wedding in March. Are you available?",
            timestamp: "2 hours ago",
            unread: true,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 2,
            senderName: "Kofi Adjei",
            lastMessage: "Thank you for the great service at our corporate event!",
            timestamp: "1 day ago",
            unread: false,
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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
        return <Clock className="h-4 w-4" />
    }
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-gray-600 hover:text-purple-600">
              Browse Services
            </Link>
            <Link href="/dashboard" className="text-purple-600 font-medium">
              Dashboard
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-purple-600">
              Messages
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-purple-600">
              Profile
            </Link>
            <Button size="sm" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">
                {user.type === "provider"
                  ? "Manage your services and bookings"
                  : "Track your bookings and find new services"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none" asChild>
                <Link href={user.type === "provider" ? "/profile/settings" : "/browse"}>
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{user.type === "provider" ? "Edit Profile" : "Book Service"}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {user.type === "provider" ? "Total Bookings" : "My Bookings"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">{mockStats.totalBookings}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500">+{mockStats.monthlyGrowth}%</span>
                <span className="text-gray-500 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {user.type === "provider" ? "Total Earnings" : "Total Spent"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    GHC {user.type === "provider" ? mockStats.totalEarnings : mockStats.totalSpent}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500">+8.2%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          {user.type === "provider" && (
            <>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-xl sm:text-2xl font-bold">{mockStats.averageRating}</p>
                    </div>
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                  </div>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < Math.floor(mockStats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-xl sm:text-2xl font-bold">{mockStats.profileViews}</p>
                    </div>
                    <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+15%</span>
                    <span className="text-gray-500 ml-1">this week</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.type === "seeker" && (
            <>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Saved Providers</p>
                      <p className="text-xl sm:text-2xl font-bold">8</p>
                    </div>
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                  </div>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <span className="text-gray-500">View saved list</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Active Searches</p>
                      <p className="text-xl sm:text-2xl font-bold">3</p>
                    </div>
                    <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <span className="text-gray-500">Manage alerts</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            {user.type === "provider" && (
              <TabsTrigger value="analytics" className="hidden md:flex">
                Analytics
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/bookings">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.clientName} />
                          <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{booking.clientName}</p>
                          <p className="text-sm text-gray-600 truncate">{booking.service}</p>
                          <p className="text-xs text-gray-500">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">GHC {booking.amount}</p>
                          <Badge variant="secondary" className={`${getStatusColor(booking.status)} text-white text-xs`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="hidden sm:flex bg-transparent">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Messages</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/messages">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {mockMessages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.senderName} />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{message.senderName}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                            {message.unread && <div className="h-2 w-2 bg-purple-600 rounded-full"></div>}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.lastMessage}</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {user.type === "provider" && (
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Trends</CardTitle>
                    <CardDescription>Your booking performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>This Month</span>
                          <span>12 bookings</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Last Month</span>
                          <span>8 bookings</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>2 Months Ago</span>
                          <span>6 bookings</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Growth</CardTitle>
                    <CardDescription>Monthly revenue comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">January 2025</span>
                        <span className="font-semibold">GHC 5,200</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">December 2024</span>
                        <span className="font-semibold">GHC 4,800</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">November 2024</span>
                        <span className="font-semibold">GHC 3,600</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Growth Rate</span>
                          <span className="text-green-600 font-semibold">+8.3%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
