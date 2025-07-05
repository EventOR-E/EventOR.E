"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Star,
  Heart,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      color: "from-blue-400 to-purple-500",
      description: "Discover amazing events",
    },
    {
      name: "Browse",
      href: "/browse",
      icon: Search,
      color: "from-green-400 to-blue-500",
      description: "Find perfect providers",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Calendar,
      color: "from-purple-400 to-pink-500",
      description: "Manage your bookings",
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      color: "from-yellow-400 to-orange-500",
      description: "Chat with providers",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      color: "from-pink-400 to-red-500",
      description: "Your account settings",
    },
  ]

  const quickActions = [
    { name: "Favorites", icon: Heart, count: 12, color: "from-pink-400 to-rose-500" },
    { name: "Reviews", icon: Star, count: 8, color: "from-yellow-400 to-orange-500" },
    { name: "Bookings", icon: Calendar, count: 3, color: "from-blue-400 to-cyan-500" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-r-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-4 ring-white/30">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-purple-100 text-sm">Premium Member</p>
                <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <div key={index} className={`bg-gradient-to-br ${action.color} rounded-xl p-3 text-white text-center`}>
                  <action.icon className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-lg font-bold">{action.count}</div>
                  <div className="text-xs opacity-90">{action.name}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mx-4" />

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              Navigation
            </h3>

            {navigationItems.map((item, index) => (
              <Link key={index} href={item.href} onClick={() => setIsOpen(false)}>
                <div className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/80 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  <Zap className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <Separator className="mx-4" />

          {/* Footer Actions */}
          <div className="p-4 space-y-2">
            <Link href="/profile/settings" onClick={() => setIsOpen(false)}>
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
              </div>
            </Link>

            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <LogOut className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-red-600 group-hover:text-red-700">Sign Out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
