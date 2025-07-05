"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Star, MapPin, Heart, Share2, Sparkles, Crown, Zap } from "lucide-react"
import Link from "next/link"

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("rating")
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  const mockProviders = [
    {
      id: 1,
      name: "Elite Wedding Planners",
      category: "Wedding Planning",
      rating: 4.9,
      reviews: 127,
      location: "Accra",
      price: 2500,
      image: "/placeholder.jpg",
      description: "Creating magical wedding experiences with attention to every detail",
      verified: true,
      responseTime: "Within 2 hours",
      completedEvents: 150,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      name: "Rhythm & Beats DJ",
      category: "DJ Services",
      rating: 4.8,
      reviews: 89,
      location: "Kumasi",
      price: 800,
      image: "/placeholder.jpg",
      description: "Professional DJ services for all types of events and celebrations",
      verified: true,
      responseTime: "Within 1 hour",
      completedEvents: 200,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: 3,
      name: "Capture Moments Photography",
      category: "Photography",
      rating: 4.9,
      reviews: 156,
      location: "Tema",
      price: 1200,
      image: "/placeholder.jpg",
      description: "Professional photography services capturing your special moments",
      verified: true,
      responseTime: "Within 3 hours",
      completedEvents: 300,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 4,
      name: "Gourmet Catering Co.",
      category: "Catering",
      rating: 4.7,
      reviews: 94,
      location: "Accra",
      price: 1800,
      image: "/placeholder.jpg",
      description: "Exquisite catering services with international and local cuisine",
      verified: true,
      responseTime: "Within 4 hours",
      completedEvents: 120,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 5,
      name: "Elegant Decorations",
      category: "Decoration",
      rating: 4.6,
      reviews: 73,
      location: "Takoradi",
      price: 1500,
      image: "/placeholder.jpg",
      description: "Beautiful event decorations that transform any space",
      verified: false,
      responseTime: "Within 6 hours",
      completedEvents: 85,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 6,
      name: "Live Entertainment Group",
      category: "Entertainment",
      rating: 4.8,
      reviews: 112,
      location: "Kumasi",
      price: 2200,
      image: "/placeholder.jpg",
      description: "Live bands and entertainment for unforgettable events",
      verified: true,
      responseTime: "Within 2 hours",
      completedEvents: 180,
      gradient: "from-red-500 to-pink-500",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProviders(mockProviders)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = [
    { value: "all", label: "All Categories", icon: Sparkles, color: "from-purple-400 to-pink-400" },
    { value: "wedding-planning", label: "Wedding Planning", icon: Heart, color: "from-pink-400 to-rose-400" },
    { value: "photography", label: "Photography", icon: Sparkles, color: "from-blue-400 to-cyan-400" },
    { value: "dj-services", label: "DJ Services", icon: Zap, color: "from-purple-400 to-indigo-400" },
    { value: "catering", label: "Catering", icon: Crown, color: "from-green-400 to-emerald-400" },
    { value: "decoration", label: "Decoration", icon: Sparkles, color: "from-yellow-400 to-orange-400" },
    { value: "entertainment", label: "Entertainment", icon: Zap, color: "from-red-400 to-pink-400" },
  ]

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "accra", label: "Accra" },
    { value: "kumasi", label: "Kumasi" },
    { value: "tema", label: "Tema" },
    { value: "takoradi", label: "Takoradi" },
    { value: "cape-coast", label: "Cape Coast" },
  ]

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || provider.category.toLowerCase().replace(" ", "-") === selectedCategory
    const matchesLocation = selectedLocation === "all" || provider.location.toLowerCase() === selectedLocation
    const matchesPrice = provider.price >= priceRange[0] && provider.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          <p className="text-lg text-gray-600">Loading amazing providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Browse Event Providers</h1>
          <p className="text-xl text-center text-purple-100 mb-8">Find the perfect professionals for your event</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-transparent border-0 text-white placeholder-white/70 focus:ring-0"
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl md:hidden"
                    >
                      <Filter className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] bg-gradient-to-br from-purple-50 to-pink-50">
                    <SheetHeader>
                      <SheetTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Filter Providers
                      </SheetTitle>
                      <SheetDescription>Refine your search to find the perfect provider</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="bg-white border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger className="bg-white border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-4 block">
                          Price Range: GH₵{priceRange[0]} - GH₵{priceRange[1]}
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80">
            <Card className="sticky top-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <button
                          key={category.value}
                          onClick={() => setSelectedCategory(category.value)}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            selectedCategory === category.value
                              ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-white border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-4 block">
                    Price Range: GH₵{priceRange[0]} - GH₵{priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white border-purple-200">
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
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {filteredProviders.length} Providers Found
              </h2>

              <div className="hidden md:block">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white border-purple-200">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="group hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl bg-white"
                >
                  <div className="relative">
                    <div
                      className={`h-48 bg-gradient-to-br ${provider.gradient} flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="text-white text-6xl font-bold opacity-20">{provider.name.charAt(0)}</div>
                      {provider.verified && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
                          ✓ Verified
                        </Badge>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                        {provider.name}
                      </h3>
                    </div>

                    <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700">
                      {provider.category}
                    </Badge>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span>({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-red-400" />
                        <span>{provider.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{provider.completedEvents} events completed</span>
                      <span className="text-green-600">⚡ {provider.responseTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        From GH₵{provider.price}
                      </span>
                      <Link href={`/provider/${provider.id}`}>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No providers found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
