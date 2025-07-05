"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
  Sparkles,
  Crown,
  Zap,
  Heart,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function DashboardPage() {
  const [userType, setUserType] = useState("provider") // 'provider' or 'seeker'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const earningsData = [
    { month: "Jan", earnings: 2400, bookings: 12 },
    { month: "Feb", earnings: 3200, bookings: 16 },
    { month: "Mar", earnings: 2800, bookings: 14 },
    { month: "Apr", earnings: 4100, bookings: 20 },
    { month: "May", earnings: 3600, bookings: 18 },
    { month: "Jun", earnings: 4800, bookings: 24 },
  ]

  const recentBookings = [
    {
      id: 1,
      client: "Sarah Johnson",
      event: "Wedding Photography",
      date: "2024-01-15",
      amount: 1200,
      status: "confirmed",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      client: "Michael Brown",
      event: "Birthday DJ Service",
      date: "2024-01-18",
      amount: 800,
      status: "pending",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      client: "Emily Davis",
      event: "Corporate Catering",
      date: "2024-01-20",
      amount: 2500,
      status: "completed",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Alex Thompson",
      message: "Hi, I'm interested in your wedding planning services...",
      time: "2 hours ago",
      unread: true,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      sender: "Lisa Chen",
      message: "Thank you for the amazing photography session!",
      time: "5 hours ago",
      unread: false,
      avatar: "/placeholder-user.jpg",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
              <p className="text-purple-100">Here's what's happening with your business today</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-2">
                <Crown className="h-4 w-4 mr-1" />
                Premium Provider
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Earnings</p>
                  <p className="text-2xl md:text-3xl font-bold">GH₵21,200</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-sm text-blue-100">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Bookings</p>
                  <p className="text-2xl md:text-3xl font-bold">24</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-sm text-green-100">8 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Clients</p>
                  <p className="text-2xl md:text-3xl font-bold">156</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
              <div className="flex items-center mt-2">
                <Heart className="h-4 w-4 text-pink-300 mr-1" />
                <span className="text-sm text-purple-100">98% satisfaction</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Avg Rating</p>
                  <p className="text-2xl md:text-3xl font-bold">4.9</p>
                </div>
                <Star className="h-8 w-8 text-yellow-200 fill-current" />
              </div>
              <div className="flex items-center mt-2">
                <Sparkles className="h-4 w-4 text-yellow-300 mr-1" />
                <span className="text-sm text-yellow-100">127 reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Earnings Overview
                  </CardTitle>
                  <CardDescription className="text-blue-100">Your earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer
                    config={{
                      earnings: {
                        label: "Earnings",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke="url(#colorGradient)"
                          strokeWidth={3}
                          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-green-100">Latest updates on your bookings</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                            {booking.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{booking.client}</p>
                          <p className="text-sm text-gray-500 truncate">{booking.event}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            GH₵{booking.amount}
                          </p>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              booking.status === "confirmed"
                                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                : booking.status === "pending"
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Management
                </CardTitle>
                <CardDescription className="text-purple-100">Manage your upcoming and past bookings</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-200">
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                            {booking.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.client}</h3>
                          <p className="text-gray-600">{booking.event}</p>
                          <p className="text-sm text-gray-500">{booking.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          GH₵{booking.amount}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <CardDescription className="text-green-100">Stay connected with your clients</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-200 ${
                        message.unread
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                        <AvatarImage src={message.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{message.sender}</h4>
                          <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{message.message}</p>
                        {message.unread && (
                          <Badge className="mt-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white">New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Monthly Bookings
                  </CardTitle>
                  <CardDescription className="text-yellow-100">Booking trends over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer
                    config={{
                      bookings: {
                        label: "Bookings",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="bookings" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-pink-100">Your service quality indicators</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Response Rate</span>
                      <span className="text-sm font-bold text-green-600">95%</span>
                    </div>
                    <Progress value={95} className="h-3 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: "95%" }}
                      ></div>
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Client Satisfaction</span>
                      <span className="text-sm font-bold text-purple-600">98%</span>
                    </div>
                    <Progress value={98} className="h-3 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
                        style={{ width: "98%" }}
                      ></div>
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Booking Completion</span>
                      <span className="text-sm font-bold text-blue-600">92%</span>
                    </div>
                    <Progress value={92} className="h-3 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: "92%" }}
                      ></div>
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Repeat Clients</span>
                      <span className="text-sm font-bold text-orange-600">78%</span>
                    </div>
                    <Progress value={78} className="h-3 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                        style={{ width: "78%" }}
                      ></div>
                    </Progress>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
