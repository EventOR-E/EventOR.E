"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Loader2, Shield, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  bookingId: number
  amount: number
  providerName: string
  serviceName: string
}

const PAYMENT_METHODS = [
  {
    id: "mtn_mobile_money",
    name: "MTN Mobile Money",
    type: "mobile_money",
    icon: "📱",
    description: "Pay with your MTN Mobile Money account",
  },
  {
    id: "vodafone_cash",
    name: "Vodafone Cash",
    type: "mobile_money",
    icon: "📱",
    description: "Pay with your Vodafone Cash account",
  },
  {
    id: "airteltigo_money",
    name: "AirtelTigo Money",
    type: "mobile_money",
    icon: "📱",
    description: "Pay with your AirtelTigo Money account",
  },
  {
    id: "visa_card",
    name: "Visa Card",
    type: "card",
    icon: "💳",
    description: "Pay with your Visa debit or credit card",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    type: "card",
    icon: "💳",
    description: "Pay with your Mastercard debit or credit card",
  },
]

export default function PaymentForm({ bookingId, amount, providerName, serviceName }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardName: "",
  })

  const selectedPaymentMethod = PAYMENT_METHODS.find((method) => method.id === selectedMethod)

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!selectedMethod) {
      throw new Error("Please select a payment method")
    }

    if (selectedPaymentMethod?.type === "mobile_money") {
      if (!paymentData.phoneNumber) {
        throw new Error("Please enter your mobile money phone number")
      }
      if (!/^(\+233|0)[2-9]\d{8}$/.test(paymentData.phoneNumber)) {
        throw new Error("Please enter a valid Ghanaian phone number")
      }
    }

    if (selectedPaymentMethod?.type === "card") {
      if (
        !paymentData.cardNumber ||
        !paymentData.expiryMonth ||
        !paymentData.expiryYear ||
        !paymentData.cvv ||
        !paymentData.cardName
      ) {
        throw new Error("Please fill in all card details")
      }
      if (paymentData.cardNumber.replace(/\s/g, "").length < 16) {
        throw new Error("Please enter a valid card number")
      }
      if (paymentData.cvv.length < 3) {
        throw new Error("Please enter a valid CVV")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      validateForm()

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          paymentMethod: selectedMethod,
          amount,
          phoneNumber: paymentData.phoneNumber,
          cardDetails:
            selectedPaymentMethod?.type === "card"
              ? {
                  number: paymentData.cardNumber.replace(/\s/g, ""),
                  expiryMonth: paymentData.expiryMonth,
                  expiryYear: paymentData.expiryYear,
                  cvv: paymentData.cvv,
                  name: paymentData.cardName,
                }
              : undefined,
        }),
      })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        const textResponse = await response.text()
        throw new Error(`Payment processing error: ${textResponse.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(result.error || `Payment failed with status: ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Payment processing failed")
      }

      // Redirect to success page
      router.push(`/booking/${bookingId}/success`)
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : "Payment processing failed")
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Provider:</span>
            <span className="font-medium">{providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>GHC {amount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Payment Method</Label>
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <Label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Mobile Money Details */}
            {selectedPaymentMethod?.type === "mobile_money" && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="h-4 w-4" />
                  {selectedPaymentMethod.name} Details
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Money Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., +233244123456 or 0244123456"
                    value={paymentData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You will receive a prompt on your phone to authorize the payment
                  </p>
                </div>
              </div>
            )}

            {/* Card Details */}
            {selectedPaymentMethod?.type === "card" && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" />
                  Card Details
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Name on card"
                      value={paymentData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Input
                        id="expiryMonth"
                        type="text"
                        placeholder="MM"
                        value={paymentData.expiryMonth}
                        onChange={(e) =>
                          handleInputChange("expiryMonth", e.target.value.replace(/\D/g, "").slice(0, 2))
                        }
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Input
                        id="expiryYear"
                        type="text"
                        placeholder="YY"
                        value={paymentData.expiryYear}
                        onChange={(e) => handleInputChange("expiryYear", e.target.value.replace(/\D/g, "").slice(0, 2))}
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !selectedMethod}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>Pay GHC {amount.toLocaleString()}</>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your payment is secured with 256-bit SSL encryption. Funds will be held in escrow until service
              completion.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
