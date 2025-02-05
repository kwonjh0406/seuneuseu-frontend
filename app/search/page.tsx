"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { UserSearchResult } from "@/components/user-search-result"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"

// 사용자가 반환할 데이터 타입 정의
interface SearchUserResponse {
  username: string;
  name: string;
  profileImageUrl: string;
}

export default function SearchPage() {
  const loggedInUsername = useLoggedInUsername();
  
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUserResponse[]>([])  // 타입 지정
  const [allUsers, setAllUsers] = useState<SearchUserResponse[]>([]) // 전체 유저 목록
  const [loading, setLoading] = useState(false)

  

  // 페이지 로딩 시 한 번만 유저 목록을 받아옴
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/search`)
        setAllUsers(response.data.data)  // 응답 데이터로 전체 유저 목록 저장
        setSearchResults(response.data.data)  // 검색결과에 초기 유저 목록을 그대로 설정
      } catch (error) {
        console.error('Error fetching users:', error)
        setSearchResults([])  // 오류 발생 시 빈 배열 설정
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, []) // 컴포넌트가 마운트될 때 한 번만 실행

  // 검색어가 변경될 때마다 결과를 필터링
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults(allUsers)  // 검색어가 비어 있으면 전체 유저 목록 표시
    } else {
      const filteredResults = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredResults)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username={loggedInUsername}/>
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <Header title="검색" loggedInUsername={loggedInUsername} />

        <div className="max-w-[640px] mx-auto px-4 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="사용자 검색"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground mt-8">Loading...</div>
          ) : (
            <>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <UserSearchResult
                    key={user.username}
                    {...user}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
