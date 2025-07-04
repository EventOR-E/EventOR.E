"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Heart,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock user type - in real app, this would come from authentication
const userType = "provider" // or "seeker"

// Mock data
const dashboardData = {
  provider: {
    stats: {
      totalEarnings: 15420,
      activeBookings: 8,
      profileViews: 234,
      responseRate: 95,
    },
    recentBookings: [
      {
        id: 1,
        client: "Akosua Mensah",
        service: "Wedding Photography",
        date: "2024-01-15",
        amount: 2500,
        status: "confirmed",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        client: "Kofi Adjei",
        service: "Corporate Event",
        date: "2024-01-20",
        amount: 1200,
        status: "pending",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        client: "Ama Osei",
        service: "Birthday Party",
        date: "2024-01-25",
        amount: 800,
        status: "completed",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    messages: [
      {
        id: 1,
        from: "Akosua Mensah",
        message: "Hi, I'd like to discuss my wedding photography needs...",
        time: "2 hours ago",
        unread: true,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        from: "Kofi Adjei",
        message: "Thank you for the quick response. When can we meet?",
        time: "5 hours ago",
        unread: false,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  seeker: {
    savedProviders: [
      {
        id: 1,
        name: "Kwame Asante Photography",
        category: "Photography",
        rating: 4.9,
        location: "Accra, Greater Accra",
        price: "GHC 800/day",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Afia's Catering Services",
        category: "Catering",
        rating: 4.8,
        location: "Kumasi, Ashanti",
        price: "GHC 45/person",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    activeBookings: [
      {
        id: 1,
        provider: "Kwame Asante Photography",
        service: "Wedding Photography",
        date: "2024-02-14",
        amount: 2500,
        status: "confirmed",
      },
      {
        id: 2,
        provider: "DJ Kobby Entertainment",
        service: "Wedding DJ",
        date: "2024-02-14",
        amount: 1200,
        status: "pending",
      },
    ],
  },
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
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
      default:
        return <AlertCircle className="h-4 w-4" />
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
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === "provider" ? "Provider Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-gray-600">
            {userType === "provider"
              ? "Manage your bookings, track earnings, and grow your business"
              : "Track your bookings, discover new providers, and plan your events"}
          </p>
        </div>

        {userType === "provider" ? (
          // Provider Dashboard
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold">
                        GHC {dashboardData.provider.stats.totalEarnings.toLocaleString()}
                      </p>
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
                      <p className="text-2xl font-bold">{dashboardData.provider.stats.activeBookings}</p>
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
                      <p className="text-2xl font-bold">{dashboardData.provider.stats.profileViews}</p>
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
                      <p className="text-2xl font-bold">{dashboardData.provider.stats.responseRate}%</p>
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
                  <div className="space-y-4">
                    {dashboardData.provider.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.client} />
                            <AvatarFallback>{booking.client[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{booking.client}</p>
                            <p className="text-sm text-gray-600">{booking.service}</p>
                            <p className="text-sm text-gray-500">{booking.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">GHC {booking.amount}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest messages from potential clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.provider.messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.from} />
                          <AvatarFallback>{message.from[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{message.from}</p>
                            <span className="text-sm text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{message.message}</p>
                          {message.unread && (
                            <Badge variant="secondary" className="mt-2">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/messages">View All Messages</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your business performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm text-gray-600">4.9/5</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Response Rate</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Seeker Dashboard
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Active Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Bookings</CardTitle>
                  <CardDescription>Your upcoming events and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.seeker.activeBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{booking.provider}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <p className="text-sm text-gray-500">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">GHC {booking.amount}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              {/* Saved Providers */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved Providers</CardTitle>
                  <CardDescription>Your favorite service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.seeker.savedProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center gap-3 p-4 border rounded-lg">
                        <Image
                          src={provider.image || "/placeholder.svg"}
                          alt={provider.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{provider.name}</p>
                          <p className="text-sm text-gray-600">{provider.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{provider.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{provider.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">{provider.price}</p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/browse">Browse More Providers</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to help you plan your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col" asChild>
                    <Link href="/browse">
                      <Users className="h-6 w-6 mb-2" />
                      Find Providers
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/messages">
                      <MessageCircle className="h-6 w-6 mb-2" />
                      View Messages
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/profile">
                      <Heart className="h-6 w-6 mb-2" />
                      My Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
