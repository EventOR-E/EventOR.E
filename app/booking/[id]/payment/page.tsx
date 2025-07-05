"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Shield, Calendar, MapPin, Users, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

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
  createdAt: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    // Card payment fields
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    // Mobile money fields
    phoneNumber: "",
    network: "",
  })

  useEffect(() => {
    // Load booking data from localStorage (in real app, fetch from API)
    const bookingData = localStorage.getItem(`booking_${bookingId}`)
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    }
    setLoading(false)
  }, [bookingId])

  const handlePaymentDataChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return

    setIsProcessing(true)

    try {
      // Validate payment method
      if (!paymentMethod) {
        throw new Error("Please select a payment method")
      }

      if (paymentMethod === "card") {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
          throw new Error("Please fill in all card details")
        }
      } else if (paymentMethod === "mobile_money") {
        if (!paymentData.phoneNumber || !paymentData.network) {
          throw new Error("Please fill in mobile money details")
        }
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate 90% success rate
      if (Math.random() > 0.9) {
        throw new Error("Payment failed. Please try again.")
      }

      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

      // Update booking status
      const updatedBooking = {
        ...booking,
        status: "confirmed",
        paymentMethod,
        transactionId,
        paidAt: new Date().toISOString(),
      }

      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(updatedBooking))

      // Redirect to success page
      router.push(`/booking/${bookingId}/success`)
    } catch (error) {
      console.error("Payment error:", error)
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
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
            <p className="text-gray-600">The booking you're trying to pay for doesn't exist.</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
            <p className="text-gray-600">Secure payment for your event booking</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <Label>Select Payment Method</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === "mobile_money"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("mobile_money")}
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-semibold">Mobile Money</h3>
                              <p className="text-sm text-gray-600">MTN, Vodafone, AirtelTigo</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === "card"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-semibold">Card Payment</h3>
                              <p className="text-sm text-gray-600">Visa, Mastercard</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Money Form */}
                    {paymentMethod === "mobile_money" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="network">Mobile Network</Label>
                          <Select
                            value={paymentData.network}
                            onValueChange={(value) => handlePaymentDataChange("network", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your network" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                              <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                              <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="e.g., 0241234567"
                            value={paymentData.phoneNumber}
                            onChange={(e) => handlePaymentDataChange("phoneNumber", e.target.value)}
                          />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Instructions:</strong> After clicking "Pay Now", you'll receive a prompt on your
                            phone to authorize the payment.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            type="text"
                            placeholder="Full name on card"
                            value={paymentData.cardholderName}
                            onChange={(e) => handlePaymentDataChange("cardholderName", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={(e) => handlePaymentDataChange("cardNumber", formatCardNumber(e.target.value))}
                            maxLength={19}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              type="text"
                              placeholder="MM/YY"
                              value={paymentData.expiryDate}
                              onChange={(e) => handlePaymentDataChange("expiryDate", formatExpiryDate(e.target.value))}
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="text"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={(e) => handlePaymentDataChange("cvv", e.target.value.replace(/\D/g, ""))}
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-800">Your payment information is encrypted and secure.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing || !paymentMethod}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>Pay GHC {booking.totalAmount.toLocaleString()}</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{booking.providerName}</h3>
                    <p className="text-sm text-gray-600">{booking.serviceName}</p>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
                      </span>
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

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>GHC {booking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>GHC {booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">Payment Protection</p>
                      <p className="text-green-700">
                        Your payment is held securely until your event is completed successfully.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
