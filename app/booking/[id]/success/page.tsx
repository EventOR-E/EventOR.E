"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, MapPin, Users, Clock, Download, MessageCircle, Home } from "lucide-react"

interface BookingData {
  id: number
  providerId: number
  providerName: string
  serviceId: number
  serviceName: string
  eventDate: string
  eventTime: string
  location: string
  guestCount: number
  specialRequirements: string
  totalAmount: number
  status: string
  paymentMethod: string
  transactionId: string
  paidAt: string
  createdAt: string
}

export default function BookingSuccessPage() {
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load booking data from localStorage (in real app, fetch from API)
    const bookingData = localStorage.getItem(`booking_${bookingId}`)
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    }
    setLoading(false)
  }, [bookingId])

  const handleDownloadReceipt = () => {
    if (!booking) return

    // Create a simple text receipt
    const receiptContent = `
EVENTOR BOOKING RECEIPT
======================

Booking ID: ${booking.id}
Transaction ID: ${booking.transactionId}
Date: ${new Date(booking.paidAt).toLocaleString()}

SERVICE PROVIDER
${booking.providerName}
Service: ${booking.serviceName}

EVENT DETAILS
Date: ${new Date(booking.eventDate).toLocaleDateString()}
Time: ${booking.eventTime}
Location: ${booking.location}
Guests: ${booking.guestCount}

PAYMENT DETAILS
Amount: GHC ${booking.totalAmount.toLocaleString()}
Method: ${booking.paymentMethod === "mobile_money" ? "Mobile Money" : "Card Payment"}
Status: Paid

Thank you for using EventOR!
    `

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `EventOR-Receipt-${booking.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-gray-600">The booking you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <a href="/browse">Browse Providers</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">Your booking has been confirmed and payment processed.</p>
              <Badge className="bg-green-100 text-green-800 border-green-200">Booking Confirmed</Badge>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Provider */}
              <div>
                <h3 className="font-semibold text-lg mb-2">{booking.providerName}</h3>
                <p className="text-gray-600">{booking.serviceName}</p>
              </div>

              <Separator />

              {/* Event Information */}
              <div className="space-y-3">
                <h4 className="font-medium">Event Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{booking.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{booking.guestCount} guests</span>
                  </div>
                </div>
              </div>

              {booking.specialRequirements && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Requirements</h4>
                    <p className="text-sm text-gray-600">{booking.specialRequirements}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Information */}
              <div className="space-y-3">
                <h4 className="font-medium">Payment Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{booking.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{booking.paymentMethod === "mobile_money" ? "Mobile Money" : "Card Payment"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">GHC {booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span>{new Date(booking.paidAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Provider Confirmation</p>
                    <p className="text-sm text-gray-600">
                      The service provider will contact you within 24 hours to confirm details and discuss your event.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Event Planning</p>
                    <p className="text-sm text-gray-600">
                      Work with your provider to finalize all event details and requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Event Day</p>
                    <p className="text-sm text-gray-600">
                      Enjoy your event! Payment will be released to the provider after successful completion.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleDownloadReceipt} variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>

            <Button variant="outline" className="w-full bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Provider
            </Button>

            <Button asChild className="w-full">
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
