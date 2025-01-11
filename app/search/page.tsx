"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { UserSearchResult } from "@/components/user-search-result"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

// Mock data for demonstration
const mockUsers = [
  {
    username: "johndoe",
    name: "John Doe",
    avatar: "/placeholder.svg",
    bio: "Software engineer | Coffee enthusiast",
    isFollowing: false,
  },
  {
    username: "janedoe",
    name: "Jane Doe",
    avatar: "/placeholder.svg",
    bio: "Digital artist | Nature lover",
    isFollowing: true,
  },
  {
    username: "bobsmith",
    name: "Bob Smith",
    avatar: "/placeholder.svg",
    bio: "Entrepreneur | Tech geek",
    isFollowing: false,
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockUsers)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real app, you'd call an API here. For now, we'll just filter the mock data.
    const filteredResults = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filteredResults)
  }

  const handleFollow = (username: string) => {
    setSearchResults(prevResults =>
      prevResults.map(user =>
        user.username === username ? { ...user, isFollowing: !user.isFollowing } : user
      )
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username="asdf"/>
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">검색</h1>
        </header>

        <div className="max-w-[640px] mx-auto px-4 py-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {searchResults.map((user) => (
              <UserSearchResult
                key={user.username}
                {...user}
                onFollow={() => handleFollow(user.username)}
              />
            ))}
          </div>

          {searchResults.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">No users found</p>
          )}
        </div>
      </main>
    </div>
  )
}

