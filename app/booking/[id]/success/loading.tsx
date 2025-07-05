import { Card, CardContent } from "@/components/ui/card"

export default function BookingSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <h2 className="text-xl font-semibold">Processing your booking...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment and booking details.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
