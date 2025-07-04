"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Send, Search, Paperclip, MoreVertical, Phone, Video, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock conversations data
const defaultConversations = [
  {
    id: 1,
    name: "Akosua Mensah",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the quick response! When can we schedule a call?",
    time: "2 min ago",
    unread: 2,
    online: true,
    type: "client",
  },
  {
    id: 2,
    name: "Kofi Adjei",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The photos look amazing! Can you send the full gallery?",
    time: "1 hour ago",
    unread: 0,
    online: false,
    type: "client",
  },
]

// Mock messages for different conversations
const messagesByConversation: { [key: number]: any[] } = {
  1: [
    {
      id: 1,
      sender: "Akosua Mensah",
      content:
        "Hi! I saw your photography portfolio and I'm really impressed. I'm planning my wedding for February 14th and would love to discuss your services.",
      time: "10:30 AM",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      sender: "You",
      content:
        "Hello Akosua! Thank you for reaching out. I'd be delighted to help capture your special day. February 14th sounds wonderful! Could you tell me more about your wedding plans?",
      time: "10:45 AM",
      isOwn: true,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ],
  // Default empty messages for new conversations
  default: [],
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState(defaultConversations)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const searchParams = useSearchParams()
  const providerId = searchParams.get("provider")

  useEffect(() => {
    // Check if we're coming from a provider message button
    if (providerId) {
      const selectedProviderData = localStorage.getItem("selectedProvider")
      if (selectedProviderData) {
        const providerData = JSON.parse(selectedProviderData)

        // Check if conversation already exists
        const existingConversation = conversations.find((conv) => conv.id === Number.parseInt(providerId))

        if (existingConversation) {
          // Select existing conversation
          setSelectedConversation(existingConversation)
          setMessages(messagesByConversation[existingConversation.id] || [])
        } else {
          // Create new conversation
          const newConversation = {
            ...providerData,
            lastMessage: "Start a conversation...",
            time: "now",
            unread: 0,
          }

          // Add to conversations list
          const updatedConversations = [newConversation, ...conversations]
          setConversations(updatedConversations)
          setSelectedConversation(newConversation)
          setMessages([]) // Empty messages for new conversation
        }

        // Clear the stored provider data
        localStorage.removeItem("selectedProvider")
      }
    } else if (!selectedConversation && conversations.length > 0) {
      // Default to first conversation if no provider specified
      setSelectedConversation(conversations[0])
      setMessages(messagesByConversation[conversations[0].id] || [])
    }
  }, [providerId, conversations])

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg = {
        id: Date.now(),
        sender: "You",
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        avatar: "/placeholder.svg?height=32&width=32",
      }

      // Add message to current conversation
      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)

      // Update conversation's last message
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, lastMessage: newMessage, time: "now" } : conv,
      )
      setConversations(updatedConversations)
      setSelectedConversation({ ...selectedConversation, lastMessage: newMessage, time: "now" })

      setNewMessage("")

      // Simulate provider response after 2 seconds
      setTimeout(() => {
        const providerResponse = {
          id: Date.now() + 1,
          sender: selectedConversation.name,
          content:
            "Thank you for your message! I'd be happy to discuss your event needs. What type of event are you planning?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: false,
          avatar: selectedConversation.avatar,
        }

        setMessages((prev) => [...prev, providerResponse])

        // Update conversation
        const updatedConvs = conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: providerResponse.content, time: "now", unread: 1 }
            : conv,
        )
        setConversations(updatedConvs)
      }, 2000)
    }
  }

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation)
    setMessages(messagesByConversation[conversation.id] || [])

    // Mark as read
    if (conversation.unread > 0) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv,
      )
      setConversations(updatedConversations)
    }
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
            <Link href="/browse" className="text-gray-600 hover:text-purple-600">
              Browse Services
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-purple-600">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your conversations with clients and providers</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-purple-50 border-l-4 border-l-purple-600"
                          : ""
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm truncate">{conversation.name}</p>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              variant={conversation.type === "client" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {conversation.type === "client" ? "Client" : "Provider"}
                            </Badge>
                            {conversation.unread > 0 && (
                              <Badge className="bg-purple-600 text-xs">{conversation.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          {selectedConversation ? (
            <Card className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={selectedConversation.avatar || "/placeholder.svg"}
                          alt={selectedConversation.name}
                        />
                        <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.online ? "Online now" : "Last seen 2 hours ago"}
                        {selectedConversation.category && (
                          <span className="ml-2">• {selectedConversation.category}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-600 mb-2">Start a conversation</h3>
                        <p className="text-sm text-gray-500">
                          Send a message to {selectedConversation.name} to get started
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                            <AvatarFallback>{message.sender[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`max-w-[70%] ${message.isOwn ? "text-right" : "text-left"}`}>
                            <div
                              className={`p-3 rounded-lg ${
                                message.isOwn ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={`Message ${selectedConversation.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
