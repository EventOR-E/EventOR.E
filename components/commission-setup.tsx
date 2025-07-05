"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CommissionSettings {
  commissionRate: number
  paymentMethod: string
  accountDetails: {
    accountName: string
    momoNumber?: string
    momoNetwork?: string
    bankName?: string
    accountNumber?: string
  }
}

export function CommissionSetup() {
  const [settings, setSettings] = useState<CommissionSettings>({
    commissionRate: 10,
    paymentMethod: "",
    accountDetails: {
      accountName: "EventOR Platform",
    },
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/commission-settings")
      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/commission-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Settings Updated",
          description: "Commission settings have been saved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Settings</CardTitle>
        <CardDescription>Configure how EventOR earns commission from bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="commission-rate">Commission Rate (%)</Label>
          <Input
            id="commission-rate"
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={settings.commissionRate}
            onChange={(e) =>
              setSettings({
                ...settings,
                commissionRate: Number.parseFloat(e.target.value) || 0,
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            Percentage of each booking that EventOR will earn as commission
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select
            value={settings.paymentMethod}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                paymentMethod: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="bank_account">Bank Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-name">Account Name</Label>
          <Input
            id="account-name"
            value={settings.accountDetails.accountName}
            onChange={(e) =>
              setSettings({
                ...settings,
                accountDetails: {
                  ...settings.accountDetails,
                  accountName: e.target.value,
                },
              })
            }
          />
        </div>

        {settings.paymentMethod === "mobile_money" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="momo-network">Mobile Money Network</Label>
              <Select
                value={settings.accountDetails.momoNetwork || ""}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    accountDetails: {
                      ...settings.accountDetails,
                      momoNetwork: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                  <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
                  <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="momo-number">Mobile Money Number</Label>
              <Input
                id="momo-number"
                placeholder="0XX XXX XXXX"
                value={settings.accountDetails.momoNumber || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accountDetails: {
                      ...settings.accountDetails,
                      momoNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
          </>
        )}

        {settings.paymentMethod === "bank_account" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select
                value={settings.accountDetails.bankName || ""}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    accountDetails: {
                      ...settings.accountDetails,
                      bankName: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GCB Bank">GCB Bank</SelectItem>
                  <SelectItem value="Ecobank">Ecobank Ghana</SelectItem>
                  <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
                  <SelectItem value="Absa Bank">Absa Bank Ghana</SelectItem>
                  <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                  <SelectItem value="Stanbic Bank">Stanbic Bank</SelectItem>
                  <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                  <SelectItem value="CAL Bank">CAL Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={settings.accountDetails.accountNumber || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accountDetails: {
                      ...settings.accountDetails,
                      accountNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
          </>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Commission Settings
        </Button>
      </CardContent>
    </Card>
  )
}
