"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  MessageCircle,
  Heart,
  Share2,
  Camera,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react"
import BookingForm from "@/components/booking-form"

interface Service {
  id: number
  name: string
  price: number
  description: string
  duration: string
}

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
  userAvatar?: string
}

interface Provider {
  id: number
  name: string
  businessName: string
  category: string
  rating: number
  reviewCount: number
  location: string
  phone: string
  email: string
  description: string
  verified: boolean
  yearsExperience: number
  completedEvents: number
  responseTime: string
  avatar: string
  coverImage: string
  services: Service[]
  portfolio: string[]
  reviews: Review[]
}

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = Number.parseInt(params.id as string)

  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    // Mock provider data - in real app, fetch from API
    const mockProvider: Provider = {
      id: providerId,
      name: "Kwame Asante",
      businessName: "Elite Events Ghana",
      category: "Event Planning",
      rating: 4.8,
      reviewCount: 127,
      location: "Accra, Greater Accra Region",
      phone: "+233 24 123 4567",
      email: "kwame@eliteevents.gh",
      description:
        "Professional event planner with over 8 years of experience in creating memorable weddings, corporate events, and celebrations across Ghana. We specialize in luxury events with attention to every detail.",
      verified: true,
      yearsExperience: 8,
      completedEvents: 250,
      responseTime: "Within 2 hours",
      avatar: "/placeholder-user.jpg",
      coverImage: "/placeholder.jpg",
      services: [
        {
          id: 1,
          name: "Wedding Planning Package",
          price: 3500,
          description:
            "Complete wedding planning service including venue coordination, vendor management, and day-of coordination",
          duration: "3-6 months planning",
        },
        {
          id: 2,
          name: "Corporate Event Management",
          price: 2500,
          description:
            "Professional corporate event planning for conferences, product launches, and company celebrations",
          duration: "1-3 months planning",
        },
        {
          id: 3,
          name: "Birthday Party Planning",
          price: 1500,
          description:
            "Custom birthday party planning with themes, decorations, entertainment, and catering coordination",
          duration: "2-4 weeks planning",
        },
        {
          id: 4,
          name: "Event Consultation",
          price: 200,
          description:
            "1-hour consultation session to discuss your event needs and provide professional recommendations",
          duration: "1 hour session",
        },
      ],
      portfolio: [
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
      ],
      reviews: [
        {
          id: 1,
          userName: "Ama Osei",
          rating: 5,
          comment:
            "Kwame planned our wedding perfectly! Every detail was handled with care and professionalism. Highly recommended!",
          date: "2024-12-15",
          userAvatar: "/placeholder-user.jpg",
        },
        {
          id: 2,
          userName: "John Mensah",
          rating: 5,
          comment:
            "Excellent service for our corporate event. The team was professional and delivered beyond our expectations.",
          date: "2024-11-28",
          userAvatar: "/placeholder-user.jpg",
        },
        {
          id: 3,
          userName: "Grace Adjei",
          rating: 4,
          comment: "Great experience overall. The birthday party was well organized and the kids had a wonderful time.",
          date: "2024-11-10",
          userAvatar: "/placeholder-user.jpg",
        },
      ],
    }

    setProvider(mockProvider)
    setLoading(false)
  }, [providerId])

  const handleMessageClick = () => {
    if (provider) {
      localStorage.setItem(
        "selectedProvider",
        JSON.stringify({
          id: provider.id,
          name: provider.businessName,
          category: provider.category,
          avatar: provider.avatar,
          verified: provider.verified,
        }),
      )
      window.location.href = `/messages?provider=${provider.id}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Provider Not Found</h2>
            <p className="text-gray-600">The service provider you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowBookingForm(false)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>
          <BookingForm providerId={provider.id} providerName={provider.businessName} services={provider.services} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
        <img
          src={provider.coverImage || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-2xl font-bold">{provider.businessName}</h1>
                          {provider.verified && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">by {provider.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{provider.rating}</span>
                            <span>({provider.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{provider.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{provider.yearsExperience}</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{provider.completedEvents}</div>
                        <div className="text-sm text-gray-600">Events Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{provider.rating}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{provider.responseTime}</div>
                        <div className="text-sm text-gray-600">Response Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                {provider.services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                            <DollarSign className="h-5 w-5" />
                            GHC {service.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Portfolio Gallery
                    </CardTitle>
                    <CardDescription>Recent work and completed events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {provider.portfolio.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {provider.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                          <AvatarFallback>
                            {review.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.userName}</h4>
                            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
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
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book This Provider</CardTitle>
                <CardDescription>Get in touch to discuss your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => setShowBookingForm(true)} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleMessageClick}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{provider.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Responds {provider.responseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
