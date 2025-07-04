"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Calendar, Filter, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data for service providers
const serviceProviders = [
  {
    id: 1,
    name: "Kwame Asante Photography",
    category: "Photography",
    rating: 4.9,
    reviewCount: 127,
    location: "Accra, Greater Accra",
    price: "GHC 800/day",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Professional wedding and event photographer with 8+ years experience across Ghana",
    tags: ["Wedding", "Corporate", "Portrait"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Afia's Catering Services",
    category: "Catering",
    rating: 4.8,
    reviewCount: 89,
    location: "Kumasi, Ashanti",
    price: "GHC 45/person",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Authentic Ghanaian cuisine and international dishes for all occasions",
    tags: ["Wedding", "Corporate", "Traditional"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "DJ Kobby Entertainment",
    category: "DJ & Music",
    rating: 4.7,
    reviewCount: 156,
    location: "Tema, Greater Accra",
    price: "GHC 1200/event",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Professional DJ services with the latest Ghanaian and international hits",
    tags: ["Wedding", "Party", "Corporate"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Elegant Events Decor",
    category: "Decoration",
    rating: 4.9,
    reviewCount: 73,
    location: "Cape Coast, Central",
    price: "GHC 2000/event",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Beautiful event decoration with traditional and modern Ghanaian themes",
    tags: ["Wedding", "Birthday", "Corporate"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Akosua's Event Planning",
    category: "Planning",
    rating: 4.8,
    reviewCount: 94,
    location: "Takoradi, Western",
    price: "GHC 1500/event",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Full-service event planning for weddings, parties, and corporate events",
    tags: ["Wedding", "Corporate", "Birthday"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Royal Videography",
    category: "Videography",
    rating: 4.6,
    reviewCount: 112,
    location: "Tamale, Northern",
    price: "GHC 1000/day",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    description: "Cinematic wedding and event videography capturing your special moments",
    tags: ["Wedding", "Corporate", "Documentary"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [filteredProviders, setFilteredProviders] = useState(serviceProviders)
  const router = useRouter()

  const handleMessageProvider = (provider: any) => {
    // Create or find existing conversation with this provider
    const conversationData = {
      id: provider.id,
      name: provider.name,
      avatar: provider.avatar,
      category: provider.category,
      location: provider.location,
      verified: provider.verified,
      online: Math.random() > 0.5, // Random online status for demo
      type: "provider",
      lastMessage: "", // Will be empty for new conversations
      time: "now",
      unread: 0,
    }

    // Store the selected provider data for the messages page
    localStorage.setItem("selectedProvider", JSON.stringify(conversationData))

    // Navigate to messages page with provider ID
    router.push(`/messages?provider=${provider.id}`)
  }

  // Add this useEffect after the state declarations:
  useEffect(() => {
    let filtered = serviceProviders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((provider) => provider.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter((provider) => provider.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    setFilteredProviders(filtered)
  }, [searchTerm, selectedCategory, selectedLocation])

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
            <Link href="/profile" className="text-gray-600 hover:text-purple-600">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Service Providers</h1>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search for services (e.g., wedding photographer)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="dj">DJ & Music</SelectItem>
                <SelectItem value="decoration">Decoration</SelectItem>
                <SelectItem value="videography">Videography</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="accra">Greater Accra</SelectItem>
                <SelectItem value="kumasi">Ashanti</SelectItem>
                <SelectItem value="cape coast">Central</SelectItem>
                <SelectItem value="takoradi">Western</SelectItem>
                <SelectItem value="tamale">Northern</SelectItem>
                <SelectItem value="ho">Volta</SelectItem>
                <SelectItem value="koforidua">Eastern</SelectItem>
                <SelectItem value="sunyani">Brong Ahafo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-600">{filteredProviders.length} service providers found</p>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Service Provider Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={provider.image || "/placeholder.svg"}
                  alt={provider.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                {provider.verified && <Badge className="absolute top-2 left-2 bg-green-500">Verified</Badge>}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{provider.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">({provider.reviewCount} reviews)</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-3">{provider.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {provider.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-purple-600">{provider.price}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleMessageProvider(provider)}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/provider/${provider.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Providers
          </Button>
        </div>
      </div>
    </div>
  )
}
