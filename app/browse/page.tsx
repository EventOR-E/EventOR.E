"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { MobileNav } from "@/components/mobile-nav"
import {
  Calendar,
  Star,
  MapPin,
  Filter,
  Search,
  MessageCircle,
  Heart,
  Shield,
  Clock,
  DollarSign,
  Camera,
  Music,
  Utensils,
  Palette,
  Video,
  MapIcon,
  Users,
  Car,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for service providers
const mockProviders = [
  {
    id: 1,
    name: "Kwame Asante",
    businessName: "Kwame Asante Photography",
    category: "Photography",
    location: "Accra, Greater Accra",
    rating: 4.9,
    reviewCount: 127,
    startingPrice: 500,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: true,
    responseTime: "2 hours",
    completedJobs: 245,
    tags: ["Wedding", "Portrait", "Event", "Commercial"],
    description: "Professional wedding and event photographer with 8+ years experience.",
    priceRange: "GHC 500 - GHC 2,500",
  },
  {
    id: 2,
    name: "Ama Osei Catering",
    businessName: "Ama's Kitchen",
    category: "Catering",
    location: "Kumasi, Ashanti",
    rating: 4.8,
    reviewCount: 89,
    startingPrice: 15,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: true,
    responseTime: "1 hour",
    completedJobs: 156,
    tags: ["Traditional", "Continental", "Buffet", "Corporate"],
    description: "Authentic Ghanaian and continental cuisine for all occasions.",
    priceRange: "GHC 15 - GHC 50 per person",
  },
  {
    id: 3,
    name: "DJ Kobby",
    businessName: "Kobby Entertainment",
    category: "DJ & Music",
    location: "Accra, Greater Accra",
    rating: 4.7,
    reviewCount: 203,
    startingPrice: 300,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: false,
    responseTime: "30 minutes",
    completedJobs: 312,
    tags: ["Wedding", "Corporate", "Birthday", "Club"],
    description: "Professional DJ and MC services for all types of events.",
    priceRange: "GHC 300 - GHC 1,200",
  },
  {
    id: 4,
    name: "Akosua Decorations",
    businessName: "Royal Touch Decor",
    category: "Decoration",
    location: "Tema, Greater Accra",
    rating: 4.9,
    reviewCount: 67,
    startingPrice: 800,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: true,
    responseTime: "3 hours",
    completedJobs: 98,
    tags: ["Wedding", "Corporate", "Traditional", "Modern"],
    description: "Elegant event decoration and styling services.",
    priceRange: "GHC 800 - GHC 5,000",
  },
  {
    id: 5,
    name: "Kofi Video Productions",
    businessName: "KVP Studios",
    category: "Videography",
    location: "Accra, Greater Accra",
    rating: 4.6,
    reviewCount: 45,
    startingPrice: 600,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: true,
    responseTime: "4 hours",
    completedJobs: 78,
    tags: ["Wedding", "Corporate", "Documentary", "Music Video"],
    description: "Professional videography and post-production services.",
    priceRange: "GHC 600 - GHC 3,000",
  },
  {
    id: 6,
    name: "Golden Gate Venues",
    businessName: "Golden Gate Events Center",
    category: "Venue",
    location: "East Legon, Greater Accra",
    rating: 4.8,
    reviewCount: 134,
    startingPrice: 2000,
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=300",
    verified: true,
    responseTime: "1 hour",
    completedJobs: 89,
    tags: ["Wedding", "Corporate", "Conference", "Reception"],
    description: "Premium event venue with full-service amenities.",
    priceRange: "GHC 2,000 - GHC 8,000",
  },
]

const categories = [
  { name: "Photography", icon: Camera, count: 150 },
  { name: "Catering", icon: Utensils, count: 200 },
  { name: "DJ & Music", icon: Music, count: 80 },
  { name: "Decoration", icon: Palette, count: 120 },
  { name: "Videography", icon: Video, count: 90 },
  { name: "Venue", icon: MapIcon, count: 60 },
  { name: "Planning", icon: Users, count: 40 },
  { name: "Transportation", icon: Car, count: 70 },
]

const locations = [
  "All Locations",
  "Greater Accra",
  "Ashanti",
  "Northern",
  "Central",
  "Western",
  "Volta",
  "Eastern",
  "Brong Ahafo",
]

export default function BrowsePage() {
  const [providers, setProviders] = useState(mockProviders)
  const [filteredProviders, setFilteredProviders] = useState(mockProviders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("rating")
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [user, setUser] = useState(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [])

  // Filter and sort providers
  useEffect(() => {
    const filtered = providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All Categories" || provider.category === selectedCategory
      const matchesLocation = selectedLocation === "All Locations" || provider.location.includes(selectedLocation)
      const matchesPrice = provider.startingPrice >= priceRange[0] && provider.startingPrice <= priceRange[1]
      const matchesVerified = !showVerifiedOnly || provider.verified

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesVerified
    })

    // Sort providers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.startingPrice - b.startingPrice
        case "price-high":
          return b.startingPrice - a.startingPrice
        case "reviews":
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    setFilteredProviders(filtered)
  }, [providers, searchQuery, selectedCategory, selectedLocation, priceRange, sortBy, showVerifiedOnly])

  const handleMessageProvider = async (providerId: number) => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      })

      if (response.ok) {
        const conversation = await response.json()
        window.location.href = `/messages?conversation=${conversation.id}`
      }
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }

  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Services</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: GHC {priceRange[0]} - GHC {priceRange[1]}
            </label>
            <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={50} className="mt-2" />
          </div>

          {/* Verified Only */}
          <div className="flex items-center space-x-2">
            <Checkbox id="verified" checked={showVerifiedOnly} onCheckedChange={setShowVerifiedOnly} />
            <label htmlFor="verified" className="text-sm font-medium">
              Verified providers only
            </label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

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
            <Link href="/browse" className="text-purple-600 font-medium">
              Browse Services
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-purple-600">
              How It Works
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
                  Dashboard
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-purple-600">
                  Messages
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-purple-600">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-purple-600">
                  Sign In
                </Link>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services, providers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Mobile Filter and Sort */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <FilterSheet />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox id="verified-desktop" checked={showVerifiedOnly} onCheckedChange={setShowVerifiedOnly} />
              <label htmlFor="verified-desktop" className="text-sm">
                Verified only
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProviders.length} of {providers.length} service providers
          </p>
        </div>

        {/* Provider Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={provider.coverImage || "/placeholder.svg"}
                  alt={provider.businessName}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {provider.verified && (
                  <Badge className="absolute top-3 left-3 bg-green-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{provider.name}</CardTitle>
                      <CardDescription className="truncate">{provider.businessName}</CardDescription>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                    <span>({provider.reviewCount})</span>
                  </div>
                  <Badge variant="secondary">{provider.category}</Badge>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{provider.location}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {provider.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {provider.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Responds in {provider.responseTime}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium text-purple-600">{provider.priceRange}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleMessageProvider(provider.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/provider/${provider.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find more results.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Categories")
                setSelectedLocation("All Locations")
                setPriceRange([0, 5000])
                setShowVerifiedOnly(false)
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
