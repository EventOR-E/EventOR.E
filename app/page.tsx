"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin, Calendar, Users, Sparkles, Heart, Zap, Crown } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredProviders = [
    {
      id: 1,
      name: "Elite Wedding Planners",
      category: "Wedding Planning",
      rating: 4.9,
      reviews: 127,
      location: "Accra, Ghana",
      price: "From GH₵2,500",
      image: "/placeholder.jpg",
      badge: "Premium",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      name: "Rhythm & Beats DJ",
      category: "DJ Services",
      rating: 4.8,
      reviews: 89,
      location: "Kumasi, Ghana",
      price: "From GH₵800",
      image: "/placeholder.jpg",
      badge: "Popular",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 3,
      name: "Capture Moments Photography",
      category: "Photography",
      rating: 4.9,
      reviews: 156,
      location: "Tema, Ghana",
      price: "From GH₵1,200",
      image: "/placeholder.jpg",
      badge: "Top Rated",
      color: "from-blue-500 to-cyan-500",
    },
  ]

  const categories = [
    { name: "Wedding Planning", icon: Heart, count: 45, color: "bg-gradient-to-br from-pink-400 to-rose-500" },
    { name: "Photography", icon: Sparkles, count: 67, color: "bg-gradient-to-br from-purple-400 to-indigo-500" },
    { name: "DJ Services", icon: Zap, count: 34, color: "bg-gradient-to-br from-blue-400 to-cyan-500" },
    { name: "Catering", icon: Crown, count: 28, color: "bg-gradient-to-br from-green-400 to-emerald-500" },
    { name: "Decoration", icon: Sparkles, count: 52, color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
    { name: "Entertainment", icon: Users, count: 41, color: "bg-gradient-to-br from-red-400 to-pink-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Find Perfect Event Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Connect with top-rated event professionals in Ghana for unforgettable experiences
            </p>

            {/* Colorful Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search for wedding planners, photographers, DJs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 bg-transparent border-0 text-white placeholder-white/70 text-lg focus:ring-0"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-purple-200">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">2,000+</div>
                <div className="text-purple-200">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">4.9★</div>
                <div className="text-purple-200">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">Find the perfect service for your event</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={`/browse?category=${category.name.toLowerCase()}`}>
                <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-lg hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} providers</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
              Featured Providers
            </h2>
            <p className="text-xl text-gray-600">Top-rated professionals ready to make your event amazing</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProviders.map((provider) => (
              <Link key={provider.id} href={`/provider/${provider.id}`}>
                <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl">
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                      <div className="text-white text-6xl font-bold opacity-20">{provider.name.charAt(0)}</div>
                    </div>
                    <Badge
                      className={`absolute top-4 right-4 ${
                        provider.badge === "Premium"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : provider.badge === "Popular"
                            ? "bg-gradient-to-r from-purple-400 to-pink-500"
                            : "bg-gradient-to-r from-green-400 to-blue-500"
                      } text-white border-0`}
                    >
                      {provider.badge}
                    </Badge>
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

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span>({provider.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 text-red-400" />
                      <span>{provider.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {provider.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                View All Providers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              How EventOR Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to find and book your perfect event service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">1. Search & Browse</h3>
              <p className="text-gray-600">Find event service providers that match your needs and budget</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">2. Book & Pay</h3>
              <p className="text-gray-600">Secure your booking with our safe and easy payment system</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">3. Enjoy Your Event</h3>
              <p className="text-gray-600">Relax and enjoy your perfectly planned event experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Plan Your Perfect Event?</h2>
          <p className="text-xl mb-8 text-purple-100">Join thousands of satisfied customers who trust EventOR</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Find Providers
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold bg-transparent"
              >
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
