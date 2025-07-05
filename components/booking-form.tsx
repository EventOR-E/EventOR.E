"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: number
  name: string
  description: string
  basePrice: number
  pricePerGuest?: number
  category: string
}

interface BookingFormProps {
  providerId: number
  providerName: string
  services: Service[]
}

export default function BookingForm({ providerId, providerName, services }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [location, setLocation] = useState("")
  const [guestCount, setGuestCount] = useState(50)
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const calculateTotalPrice = () => {
    if (!selectedService) return 0

    const basePrice = selectedService.basePrice || 0
    const pricePerGuest = selectedService.pricePerGuest || 0
    const guestPrice = pricePerGuest * guestCount

    return basePrice + guestPrice
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService) {
      toast({
        title: "Service Required",
        description: "Please select a service to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const bookingData = {
        providerId,
        serviceId: selectedService.id,
        eventDate,
        eventTime,
        location,
        guestCount,
        specialRequirements,
        totalAmount: calculateTotalPrice(),
      }

      // For demo purposes, simulate booking creation
      const bookingId = Math.random().toString(36).substr(2, 9)

      // Store booking data in localStorage for demo
      localStorage.setItem(
        `booking_${bookingId}`,
        JSON.stringify({
          ...bookingData,
          id: bookingId,
          providerName,
          serviceName: selectedService.name,
          status: "pending_payment",
          createdAt: new Date().toISOString(),
        }),
      )

      toast({
        title: "Booking Created",
        description: "Redirecting to payment...",
      })

      // Redirect to payment page
      router.push(`/booking/${bookingId}/payment`)
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Service with {providerName}
        </CardTitle>
        <CardDescription>Fill in the details below to book your event service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select
              onValueChange={(value) => {
                const service = services.find((s) => s.id.toString() === value)
                setSelectedService(service || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatPrice(service.basePrice)}
                        {service.pricePerGuest && ` + ${formatPrice(service.pricePerGuest)}/guest`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Event Time *
              </Label>
              <Input id="time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Event Location *
            </Label>
            <Input
              id="location"
              placeholder="Enter the event venue address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Expected Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max="1000"
              value={guestCount}
              onChange={(e) => setGuestCount(Number.parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-gray-500">This helps us prepare the right amount of service for your event</p>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Any special requests, dietary restrictions, or additional information..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          {selectedService && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price ({selectedService.name})</span>
                  <span>{formatPrice(selectedService.basePrice || 0)}</span>
                </div>
                {selectedService.pricePerGuest && (
                  <div className="flex justify-between">
                    <span>Guest Fee ({guestCount} guests)</span>
                    <span>{formatPrice((selectedService.pricePerGuest || 0) * guestCount)}</span>
                  </div>
                )}
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span className="text-lg">{formatPrice(calculateTotalPrice())}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading || !selectedService} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment ({formatPrice(calculateTotalPrice())})
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
