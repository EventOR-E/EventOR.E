"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Camera, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfileSettingsPage() {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=100&width=100")
  const [coverImage, setCoverImage] = useState<string>("/placeholder.svg?height=200&width=600")
  const [portfolioImages, setPortfolioImages] = useState<string[]>([
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ])

  const handleImageUpload = (type: "profile" | "cover" | "portfolio") => {
    // Create a file input element
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = type === "portfolio"

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            if (type === "profile") {
              setProfileImage(result)
            } else if (type === "cover") {
              setCoverImage(result)
            } else if (type === "portfolio") {
              setPortfolioImages((prev) => [...prev, result])
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }

    input.click()
  }

  const removePortfolioImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
              Dashboard
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-purple-600">
              Messages
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-purple-600">
              View Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your profile information and media</p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Photos & Media</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback>KA</AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        onClick={() => handleImageUpload("profile")}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile Photo</h3>
                      <p className="text-sm text-gray-600">Upload a professional photo of yourself</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Kwame" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Asante" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue="Kwame Asante Photography" />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="kwame@asantephoto.com" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+233 24 123 4567" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select defaultValue="accra">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accra">Accra</SelectItem>
                          <SelectItem value="kumasi">Kumasi</SelectItem>
                          <SelectItem value="tamale">Tamale</SelectItem>
                          <SelectItem value="cape-coast">Cape Coast</SelectItem>
                          <SelectItem value="takoradi">Takoradi</SelectItem>
                          <SelectItem value="ho">Ho</SelectItem>
                          <SelectItem value="koforidua">Koforidua</SelectItem>
                          <SelectItem value="sunyani">Sunyani</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select defaultValue="greater-accra">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater-accra">Greater Accra</SelectItem>
                          <SelectItem value="ashanti">Ashanti</SelectItem>
                          <SelectItem value="northern">Northern</SelectItem>
                          <SelectItem value="central">Central</SelectItem>
                          <SelectItem value="western">Western</SelectItem>
                          <SelectItem value="volta">Volta</SelectItem>
                          <SelectItem value="eastern">Eastern</SelectItem>
                          <SelectItem value="brong-ahafo">Brong Ahafo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      defaultValue="Professional wedding and event photographer with 8+ years experience across Ghana. I specialize in capturing authentic moments and emotions."
                    />
                  </div>

                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Photo</CardTitle>
                  <CardDescription>Upload a cover photo that represents your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={coverImage || "/placeholder.svg"}
                        alt="Cover"
                        width={600}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button className="absolute top-4 right-4" onClick={() => handleImageUpload("cover")}>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Cover
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Photos</CardTitle>
                  <CardDescription>Upload photos of your work, equipment, or team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {portfolioImages.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Business photo ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => removePortfolioImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="aspect-square border-dashed bg-transparent"
                      onClick={() => handleImageUpload("portfolio")}
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Add Photo</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Categories</CardTitle>
                  <CardDescription>Select the services you offer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryCategory">Primary Category</Label>
                      <Select defaultValue="photography">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="videography">Videography</SelectItem>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="decoration">Decoration</SelectItem>
                          <SelectItem value="dj">DJ & Music</SelectItem>
                          <SelectItem value="planning">Event Planning</SelectItem>
                          <SelectItem value="venue">Venue</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select defaultValue="8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="8">8+ years</SelectItem>
                          <SelectItem value="10">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Service Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Wedding", "Corporate", "Portrait", "Event", "Commercial"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Set your service pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate (GHC)</Label>
                      <Input id="hourlyRate" type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label htmlFor="dailyRate">Daily Rate (GHC)</Label>
                      <Input id="dailyRate" type="number" defaultValue="800" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="packageDescription">Package Description</Label>
                    <Textarea
                      id="packageDescription"
                      rows={3}
                      placeholder="Describe what's included in your standard package..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Gallery</CardTitle>
                  <CardDescription>Showcase your best work to attract more clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioImages.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="destructive" onClick={() => removePortfolioImage(index)}>
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="aspect-square border-dashed bg-transparent"
                      onClick={() => handleImageUpload("portfolio")}
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Add to Portfolio</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
