"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit,
  Share,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Camera,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock user profile data
const userProfile = {
  id: 1,
  name: "Kwame Asante",
  businessName: "Kwame Asante Photography Studio",
  avatar: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=300&width=800",
  category: "Photography",
  location: "Accra, Greater Accra",
  joinedDate: "2019",
  verified: true,
  rating: 4.9,
  reviewCount: 127,
  completedJobs: 245,
  responseTime: "Within 2 hours",
  bio: "Professional wedding and event photographer with 8+ years of experience capturing life's most precious moments across Ghana. I specialize in candid, natural photography that tells your unique story with authentic Ghanaian flair.",
  contact: {
    phone: "+233 24 123 4567",
    email: "kwame@asantephoto.com",
    website: "www.asantephotography.com",
  },
  services: [
    {
      name: "Wedding Photography",
      price: "GHC 1,500 - GHC 3,000",
      description: "Complete wedding day coverage including traditional ceremonies",
    },
    {
      name: "Corporate Events",
      price: "GHC 200/hour",
      description: "Professional corporate event photography and headshots",
    },
    {
      name: "Portrait Sessions",
      price: "GHC 300 - GHC 500",
      description: "Individual and family portrait sessions",
    },
  ],
  portfolio: [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ],
  reviews: [
    {
      id: 1,
      author: "Akosua Mensah",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Kwame was absolutely amazing! He captured our traditional wedding ceremony perfectly and made us feel so comfortable. The photos are stunning and we couldn't be happier!",
      avatar: "/placeholder.svg?height=40&width=40",
      event: "Traditional Wedding",
    },
    {
      id: 2,
      author: "Kofi Adjei",
      rating: 5,
      date: "1 month ago",
      comment:
        "Professional, creative, and a joy to work with. Kwame went above and beyond for our corporate event in Accra. Highly recommend!",
      avatar: "/placeholder.svg?height=40&width=40",
      event: "Corporate Event",
    },
    {
      id: 3,
      author: "Ama Osei",
      rating: 4,
      date: "2 months ago",
      comment:
        "Great experience overall. Kwame was punctual and delivered beautiful photos of our naming ceremony. Would definitely book again!",
      avatar: "/placeholder.svg?height=40&width=40",
      event: "Naming Ceremony",
    },
  ],
  stats: {
    totalBookings: 245,
    repeatClients: 89,
    averageRating: 4.9,
    responseRate: 95,
  },
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about")

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
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
              Dashboard
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-purple-600">
              Messages
            </Link>
            <Link href="/browse" className="text-gray-600 hover:text-purple-600">
              Browse Services
            </Link>
          </nav>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
        <Image
          src={userProfile.coverImage || "/placeholder.svg"}
          alt="Cover"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="secondary">
            <Share className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
          <Button size="sm" asChild>
            <Link href="/profile/settings">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>KA</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                      {userProfile.verified && (
                        <Badge className="bg-green-500">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-lg text-gray-600 mb-3">{userProfile.businessName}</p>

                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{userProfile.rating}</span>
                        <span>({userProfile.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{userProfile.completedJobs} jobs completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {userProfile.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {userProfile.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-6">{userProfile.bio}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{userProfile.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{userProfile.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span>{userProfile.contact.website}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{userProfile.stats.totalBookings}</p>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{userProfile.stats.repeatClients}</p>
                        <p className="text-sm text-gray-600">Repeat Clients</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{userProfile.stats.averageRating}</p>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{userProfile.stats.responseRate}%</p>
                        <p className="text-sm text-gray-600">Response Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                {userProfile.services.map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                          <p className="text-gray-600 mb-2">{service.description}</p>
                          <p className="text-xl font-bold text-purple-600">{service.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Inquire
                          </Button>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {userProfile.portfolio.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          View Full Size
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{userProfile.rating}</p>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{userProfile.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: rating === 5 ? "80%" : rating === 4 ? "15%" : "5%" }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? "80%" : rating === 4 ? "15%" : "5%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {userProfile.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.author}</h4>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {review.event}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/profile/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Share className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/messages">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">{userProfile.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold">{userProfile.completedJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{userProfile.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge>{userProfile.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{userProfile.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{userProfile.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{userProfile.contact.website}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
