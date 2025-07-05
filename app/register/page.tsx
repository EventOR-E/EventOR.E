"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, Briefcase, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"seeker" | "provider">("seeker")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Form states for seeker
  const [seekerData, setSeekerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  // Form states for provider
  const [providerData, setProviderData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const validateForm = (data: any, isProvider: boolean) => {
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return "Please fill in all required fields"
    }

    if (isProvider && !data.businessName) {
      return "Business name is required for service providers"
    }

    if (data.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    if (data.password !== data.confirmPassword) {
      return "Passwords do not match"
    }

    if (!data.terms) {
      return "Please accept the terms and conditions"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return "Please enter a valid email address"
    }

    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const data = userType === "seeker" ? seekerData : providerData
    const validationError = validateForm(data, userType === "provider")

    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          userType,
          businessName: userType === "provider" ? providerData.businessName : undefined,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Registration failed. Please try again."

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = errorText.includes("Internal") ? "Server error. Please try again later." : errorText
        }

        setError(errorMessage)
        return
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Account Created Successfully!",
          description: `Welcome to EventOR, ${result.user.firstName}!`,
        })

        // Store user data
        localStorage.setItem("user", JSON.stringify(result.user))

        // Redirect based on user type
        if (result.user.userType === "provider") {
          router.push("/dashboard")
        } else {
          router.push("/browse")
        }
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join EventOR</h1>
          <p className="text-gray-600">Create your account and start planning amazing events</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "seeker" | "provider")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="seeker" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Event Planner
                </TabsTrigger>
                <TabsTrigger value="provider" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Service Provider
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seeker" className="space-y-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg mb-4">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900">Event Planner Account</h3>
                  <p className="text-sm text-blue-700">Find and hire service providers for your events</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={seekerData.firstName}
                        onChange={(e) => setSeekerData({ ...seekerData, firstName: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={seekerData.lastName}
                        onChange={(e) => setSeekerData({ ...seekerData, lastName: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={seekerData.email}
                      onChange={(e) => setSeekerData({ ...seekerData, email: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+233 123 456 789"
                      value={seekerData.phone}
                      onChange={(e) => setSeekerData({ ...seekerData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={seekerData.password}
                      onChange={(e) => setSeekerData({ ...seekerData, password: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={seekerData.confirmPassword}
                      onChange={(e) => setSeekerData({ ...seekerData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={seekerData.terms}
                      onCheckedChange={(checked) => setSeekerData({ ...seekerData, terms: checked as boolean })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Event Planner Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="provider" className="space-y-4 mt-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg mb-4">
                  <Briefcase className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-900">Service Provider Account</h3>
                  <p className="text-sm text-purple-700">Offer your services and grow your business</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="providerFirstName">First Name</Label>
                      <Input
                        id="providerFirstName"
                        placeholder="Jane"
                        value={providerData.firstName}
                        onChange={(e) => setProviderData({ ...providerData, firstName: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="providerLastName">Last Name</Label>
                      <Input
                        id="providerLastName"
                        placeholder="Smith"
                        value={providerData.lastName}
                        onChange={(e) => setProviderData({ ...providerData, lastName: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="Smith Photography Studio"
                      value={providerData.businessName}
                      onChange={(e) => setProviderData({ ...providerData, businessName: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="providerEmail">Email</Label>
                    <Input
                      id="providerEmail"
                      type="email"
                      placeholder="jane@smithphoto.com"
                      value={providerData.email}
                      onChange={(e) => setProviderData({ ...providerData, email: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="providerPhone">Phone Number</Label>
                    <Input
                      id="providerPhone"
                      type="tel"
                      placeholder="+233 123 456 789"
                      value={providerData.phone}
                      onChange={(e) => setProviderData({ ...providerData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="providerPassword">Password</Label>
                    <Input
                      id="providerPassword"
                      type="password"
                      placeholder="Create a strong password"
                      value={providerData.password}
                      onChange={(e) => setProviderData({ ...providerData, password: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="providerConfirmPassword">Confirm Password</Label>
                    <Input
                      id="providerConfirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={providerData.confirmPassword}
                      onChange={(e) => setProviderData({ ...providerData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="providerTerms"
                      checked={providerData.terms}
                      onCheckedChange={(checked) => setProviderData({ ...providerData, terms: checked as boolean })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="providerTerms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Service Provider Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
