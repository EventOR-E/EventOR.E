"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Menu, Calendar, Home, Search, MessageCircle, User, Settings, LogOut, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"

interface MobileNavProps {
  user?: {
    name: string
    email: string
    avatar?: string
    type: "seeker" | "provider"
    verified?: boolean
  }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">EventOR</span>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    {user.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.type === "provider" ? "Service Provider" : "Service Seeker"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              href="/browse"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <Search className="h-5 w-5" />
              <span>Browse Services</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/messages"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/profile/settings"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            <Link
              href="/how-it-works"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>How It Works</span>
            </Link>
          </nav>

          <Separator className="my-4" />

          {/* Bottom Actions */}
          <div className="space-y-2">
            {!user ? (
              <>
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent" onClick={() => setOpen(false)}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  setOpen(false)
                  handleLogout()
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
