"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  CreditCard,
  Smartphone,
  Building,
  TrendingUp,
  Calculator,
  Sparkles,
  Crown,
  Zap,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

export default function CommissionSetup() {
  const [commissionRate, setCommissionRate] = useState([15])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [accountDetails, setAccountDetails] = useState({
    mobileNumber: "",
    bankAccount: "",
    bankName: "",
    accountName: "",
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
  })

  useEffect(() => {
    fetchCommissionSettings()
    fetchStats()
  }, [])

  const fetchCommissionSettings = async () => {
    try {
      const response = await fetch("/api/admin/commission-settings")
      if (response.ok) {
        const data = await response.json()
        setCommissionRate([data.rate])
        setPaymentMethod(data.paymentMethod || "")
        setAccountDetails(data.accountDetails || {})
      }
    } catch (error) {
      console.error("Failed to fetch commission settings:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/commission-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rate: commissionRate[0],
          paymentMethod,
          accountDetails,
        }),
      })

      if (response.ok) {
        toast.success("Commission settings updated successfully!")
      } else {
        toast.error("Failed to update commission settings")
      }
    } catch (error) {
      toast.error("An error occurred while saving settings")
    } finally {
      setLoading(false)
    }
  }

  const calculateCommission = (amount: number) => {
    return (amount * commissionRate[0]) / 100
  }

  const calculateProviderAmount = (amount: number) => {
    return amount - calculateCommission(amount)
  }

  const exampleBookings = [
    { service: "Wedding Photography", amount: 2500 },
    { service: "DJ Services", amount: 800 },
    { service: "Catering", amount: 1800 },
    { service: "Event Planning", amount: 3200 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Commission Management
          </h1>
          <p className="text-xl text-gray-600">Configure your revenue settings and track earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Platform Earnings</p>
                  <p className="text-3xl font-bold">GH₵{stats.totalEarnings.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
              <div className="flex items-center mt-2">
                <Sparkles className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-sm text-green-100">All-time revenue</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Commission Earned</p>
                  <p className="text-3xl font-bold">GH₵{stats.totalCommissions.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
              <div className="flex items-center mt-2">
                <Crown className="h-4 w-4 text-blue-300 mr-1" />
                <span className="text-sm text-blue-100">Your earnings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Pending Payouts</p>
                  <p className="text-3xl font-bold">GH₵{stats.pendingPayouts.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-200" />
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-purple-300 mr-1" />
                <span className="text-sm text-purple-100">Ready to pay</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commission Rate Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Commission Rate
              </CardTitle>
              <CardDescription className="text-purple-100">Set your platform commission percentage</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold text-gray-700">Commission Rate</Label>
                  <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-lg px-3 py-1">
                    {commissionRate[0]}%
                  </Badge>
                </div>
                <Slider
                  value={commissionRate}
                  onValueChange={setCommissionRate}
                  max={50}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  <strong>Recommended:</strong> Industry standard is 10-20%. Higher rates may discourage providers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Payment Method Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription className="text-green-100">
                Configure how you receive commission payments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white border-green-200">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile-money">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        Mobile Money
                      </div>
                    </SelectItem>
                    <SelectItem value="bank-account">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        Bank Account
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "mobile-money" && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div>
                    <Label htmlFor="mobile-number" className="text-sm font-medium text-gray-700">
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile-number"
                      type="tel"
                      placeholder="0XX XXX XXXX"
                      value={accountDetails.mobileNumber}
                      onChange={(e) => setAccountDetails({ ...accountDetails, mobileNumber: e.target.value })}
                      className="mt-1 bg-white border-green-200"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "bank-account" && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div>
                    <Label htmlFor="bank-name" className="text-sm font-medium text-gray-700">
                      Bank Name
                    </Label>
                    <Input
                      id="bank-name"
                      placeholder="e.g., GCB Bank"
                      value={accountDetails.bankName}
                      onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                      className="mt-1 bg-white border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account-number" className="text-sm font-medium text-gray-700">
                      Account Number
                    </Label>
                    <Input
                      id="account-number"
                      placeholder="Account number"
                      value={accountDetails.bankAccount}
                      onChange={(e) => setAccountDetails({ ...accountDetails, bankAccount: e.target.value })}
                      className="mt-1 bg-white border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account-name" className="text-sm font-medium text-gray-700">
                      Account Name
                    </Label>
                    <Input
                      id="account-name"
                      placeholder="Account holder name"
                      value={accountDetails.accountName}
                      onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                      className="mt-1 bg-white border-blue-200"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Commission Calculator */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Commission Calculator
            </CardTitle>
            <CardDescription className="text-yellow-100">
              See how your commission rate affects different booking amounts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exampleBookings.map((booking, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-purple-50 border border-purple-100"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{booking.service}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Amount:</span>
                      <span className="font-semibold text-gray-800">GH₵{booking.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Commission:</span>
                      <span className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        GH₵{calculateCommission(booking.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider Gets:</span>
                      <span className="font-semibold text-purple-600">
                        GH₵{calculateProviderAmount(booking.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={loading || !paymentMethod}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Save Commission Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
