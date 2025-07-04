"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, Briefcase } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"seeker" | "provider">("seeker")

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

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a strong password" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
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

                  <Button className="w-full" size="lg">
                    Create Event Planner Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="provider" className="space-y-4 mt-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg mb-4">
                  <Briefcase className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-900">Service Provider Account</h3>
                  <p className="text-sm text-purple-700">Offer your services and grow your business</p>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="providerFirstName">First Name</Label>
                      <Input id="providerFirstName" placeholder="Jane" />
                    </div>
                    <div>
                      <Label htmlFor="providerLastName">Last Name</Label>
                      <Input id="providerLastName" placeholder="Smith" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="Smith Photography Studio" />
                  </div>

                  <div>
                    <Label htmlFor="providerEmail">Email</Label>
                    <Input id="providerEmail" type="email" placeholder="jane@smithphoto.com" />
                  </div>

                  <div>
                    <Label htmlFor="providerPhone">Phone Number</Label>
                    <Input id="providerPhone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <Label htmlFor="providerPassword">Password</Label>
                    <Input id="providerPassword" type="password" placeholder="Create a strong password" />
                  </div>

                  <div>
                    <Label htmlFor="providerConfirmPassword">Confirm Password</Label>
                    <Input id="providerConfirmPassword" type="password" placeholder="Confirm your password" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="providerTerms" />
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

                  <Button className="w-full" size="lg">
                    Create Service Provider Account
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
