"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, MapPin, Calendar, MessageCircle, Heart, Shield, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for a service provider
const provider = {
  id: 1,
  name: "Kwame Asante",
  businessName: "Kwame Asante Photography Studio",
  category: "Photography",
  rating: 4.9,
  reviewCount: 127,
  location: "Accra, Greater Accra",
  joinedDate: "2019",
  verified: true,
  responseTime: "Within 2 hours",
  completedJobs: 245,
  avatar: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=800",
  description:
    "Professional wedding and event photographer with 8+ years of experience capturing life's most precious moments across Ghana. I specialize in candid, natural photography that tells your unique story with authentic Ghanaian flair.",
  services: [
    { name: "Wedding Photography", price: "GHC 1,500 - GHC 3,000", duration: "8-10 hours" },
    { name: "Engagement Session", price: "GHC 400 - GHC 600", duration: "1-2 hours" },
    { name: "Corporate Events", price: "GHC 200/hour", duration: "Flexible" },
    { name: "Traditional Ceremonies", price: "GHC 800 - GHC 1,200", duration: "4-6 hours" },
  ],
  portfolio: [
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
    },
    {
      id: 2,
      author: "Kofi Adjei",
      rating: 5,
      date: "1 month ago",
      comment:
        "Professional, creative, and a joy to work with. Kwame went above and beyond for our corporate event in Accra. Highly recommend!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      author: "Ama Osei",
      rating: 4,
      date: "2 months ago",
      comment:
        "Great experience overall. Kwame was punctual and delivered beautiful photos of our naming ceremony. Would definitely book again!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

export default function ProviderProfilePage() {
  const [selectedService, setSelectedService] = useState(provider.services[0])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/browse">← Back to Browse</Link>
          </Button>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
        <Image src={provider.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover opacity-50" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{provider.name}</h1>
                      {provider.verified && (
                        <Badge className="bg-green-500">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span>({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{provider.completedJobs} jobs completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {provider.joinedDate}</span>
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
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {provider.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                {provider.services.map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <p className="text-gray-600">Duration: {service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-purple-600">{service.price}</p>
                          <Button size="sm" className="mt-2">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {provider.portfolio.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {provider.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{review.author}</h4>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
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
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">{provider.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold">{provider.completedJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{provider.joinedDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Get a Quote</CardTitle>
                <CardDescription>Tell {provider.name} about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input id="eventDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input id="eventType" placeholder="e.g., Wedding, Birthday Party" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your event and what you're looking for..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
