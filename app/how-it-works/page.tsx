import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, MessageCircle, CreditCard, Star, Shield, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-gray-600 hover:text-purple-600">
              Browse Services
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-purple-600">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How EventOR Works</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EventOR makes it easy to find, hire, and pay trusted service providers for your events across Ghana. Here's
            how our platform connects event planners with the best professionals.
          </p>
        </div>
      </section>

      {/* For Event Planners */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800">For Event Planners</Badge>
            <h2 className="text-3xl font-bold mb-4">Planning Your Perfect Event</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From weddings to corporate events, find and hire the best service providers in Ghana
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Search & Browse</h3>
              <p className="text-gray-600">
                Browse hundreds of verified service providers across Ghana. Filter by location, price, and category.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect & Discuss</h3>
              <p className="text-gray-600">
                Message providers directly, share your event details, and get custom quotes for your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Book & Pay Securely</h3>
              <p className="text-gray-600">
                Book your chosen provider and pay securely through our platform. Your money is protected in escrow.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Review & Rate</h3>
              <p className="text-gray-600">
                After your event, leave a review to help other customers and release payment to the provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Service Providers */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800">For Service Providers</Badge>
            <h2 className="text-3xl font-bold mb-4">Growing Your Business</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reach more customers, showcase your work, and grow your event services business across Ghana
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create Your Profile</h3>
              <p className="text-gray-600">
                Set up your professional profile, showcase your portfolio, and list your services with pricing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect with Clients</h3>
              <p className="text-gray-600">
                Receive inquiries from potential clients, discuss their needs, and send custom proposals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Deliver Great Service</h3>
              <p className="text-gray-600">
                Provide excellent service for booked events. Your reputation grows with every satisfied customer.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Get Paid</h3>
              <p className="text-gray-600">
                Receive secure payments after service completion. We handle all payment processing for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Security */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Your Safety is Our Priority</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built multiple layers of protection to ensure safe and secure transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Verified Providers</CardTitle>
                <CardDescription>
                  All service providers go through our verification process including ID checks and portfolio reviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Your payments are held in escrow until you confirm the service is delivered to your satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Review System</CardTitle>
                <CardDescription>
                  Our transparent review system helps you make informed decisions based on real customer experiences.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EventOR charges a small commission only when you successfully complete a transaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>For Event Planners</CardTitle>
                <CardDescription>Find and hire service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">Free</div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Browse all service providers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Message providers directly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Secure payment protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    24/7 customer support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Service Providers</CardTitle>
                <CardDescription>Grow your business with EventOR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">5% Commission</div>
                <p className="text-sm text-gray-600 mb-4">Only charged on successful bookings</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Professional profile & portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Direct client messaging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Secure payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Marketing & promotion tools
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of event planners and service providers across Ghana</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register?type=seeker">Find Services</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600 bg-transparent"
              asChild
            >
              <Link href="/register?type=provider">Offer Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-bold">EventOR</span>
          </div>
          <p className="text-gray-400">
            Your trusted platform for finding and hiring event service providers in Ghana.
          </p>
        </div>
      </footer>
    </div>
  )
}
