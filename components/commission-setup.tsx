"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Percent, CreditCard, Smartphone, Building, Info, CheckCircle, AlertCircle } from "lucide-react"

interface CommissionSettings {
  rate: number
  paymentMethod: string
  accountDetails: string
}

interface CommissionStats {
  totalTransactions: number
  totalCommission: number
  totalRevenue: number
  averageRate: number
}

export function CommissionSetup() {
  const [settings, setSettings] = useState<CommissionSettings>({
    rate: 5,
    paymentMethod: "mobile_money",
    accountDetails: "",
  })
  const [stats, setStats] = useState<CommissionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchCommissionData()
  }, [])

  const fetchCommissionData = async () => {
    try {
      // Fetch current settings
      const settingsResponse = await fetch("/api/admin/commission-settings")
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setSettings({
          rate: settingsData.rate * 100, // Convert to percentage
          paymentMethod: settingsData.payment_method || "mobile_money",
          accountDetails: settingsData.account_details || "",
        })
      }

      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Failed to fetch commission data:", error)
      setMessage({ type: "error", text: "Failed to load commission settings" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/commission-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: settings.rate / 100, // Convert to decimal
          paymentMethod: settings.paymentMethod,
          accountDetails: settings.accountDetails,
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Commission settings saved successfully!" })
        fetchCommissionData() // Refresh data
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save commission settings:", error)
      setMessage({ type: "error", text: "Failed to save commission settings" })
    } finally {
      setSaving(false)
    }
  }

  const calculateExample = (bookingAmount: number) => {
    const commissionAmount = (bookingAmount * settings.rate) / 100
    const providerAmount = bookingAmount - commissionAmount
    return { commissionAmount, providerAmount }
  }

  const exampleBookings = [500, 1000, 2500, 5000]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Commission Settings</h2>
        <p className="text-gray-600 mt-1">Configure your platform's commission rate and payment details</p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={message.type === "success" ? "border-green-500" : "border-red-500"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Commission Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-purple-600" />
                Commission Rate
              </CardTitle>
              <CardDescription>Set the percentage you charge on each successful booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="commission-rate">Commission Rate: {settings.rate}%</Label>
                <Slider
                  id="commission-rate"
                  min={0}
                  max={50}
                  step={0.5}
                  value={[settings.rate]}
                  onValueChange={(value) => setSettings({ ...settings, rate: value[0] })}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Industry standard commission rates typically range from 3% to 15%. Higher rates may discourage
                  providers from joining your platform.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Method
              </CardTitle>
              <CardDescription>Choose how you want to receive commission payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select
                  value={settings.paymentMethod}
                  onValueChange={(value) => setSettings({ ...settings, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile_money">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mobile Money (MTN/Vodafone)
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_account">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Bank Account
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="account-details">
                  {settings.paymentMethod === "mobile_money" ? "Mobile Money Number" : "Bank Account Details"}
                </Label>
                <Input
                  id="account-details"
                  placeholder={
                    settings.paymentMethod === "mobile_money"
                      ? "e.g., 0244123456 (MTN)"
                      : "Account Number, Bank Name, Branch"
                  }
                  value={settings.accountDetails}
                  onChange={(e) => setSettings({ ...settings, accountDetails: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} disabled={saving || !settings.accountDetails} className="w-full">
            {saving ? "Saving..." : "Save Commission Settings"}
          </Button>
        </div>

        {/* Preview and Stats */}
        <div className="space-y-6">
          {/* Commission Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Commission Calculator
              </CardTitle>
              <CardDescription>See how much you'll earn from different booking amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exampleBookings.map((amount) => {
                  const { commissionAmount, providerAmount } = calculateExample(amount)
                  return (
                    <div key={amount} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">GHC {amount} booking</p>
                        <p className="text-sm text-gray-600">Provider gets: GHC {providerAmount.toFixed(2)}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +GHC {commissionAmount.toFixed(2)}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Commission Statistics</CardTitle>
                <CardDescription>Your platform's commission performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions || 0}</p>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">GHC {(stats.totalCommission || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Commission</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">GHC {(stats.totalRevenue || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{((stats.averageRate || 0) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Avg. Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <span className="text-purple-600 font-bold text-xs">1</span>
                </div>
                <p>Customer makes a booking and payment through your platform</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <span className="text-purple-600 font-bold text-xs">2</span>
                </div>
                <p>Your commission is automatically calculated and deducted</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <span className="text-purple-600 font-bold text-xs">3</span>
                </div>
                <p>Remaining amount is transferred to the service provider</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <span className="text-purple-600 font-bold text-xs">4</span>
                </div>
                <p>Commission is paid to your account weekly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
