"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { UserSearchResult } from "@/components/user-search-result"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"
import { useAppContext } from "@/lib/AppContext"

// 사용자가 반환할 데이터 타입 정의
interface SearchUserResponse {
  username: string;
  name: string;
  profileImageUrl: string;
}

const PAGE_KEY = 'search';

export default function SearchPage() {
  const loggedInUsername = useLoggedInUsername();
  const { getTabState, setTabState, saveScrollPosition, restoreScrollPosition, savePageScrollPosition } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedState = getTabState(PAGE_KEY, 'main');
    return savedState?.searchQuery || "";
  })
  const [searchResults, setSearchResults] = useState<SearchUserResponse[]>(() => {
    const savedState = getTabState(PAGE_KEY, 'main');
    return savedState?.data?.searchResults || [];
  })
  const [allUsers, setAllUsers] = useState<SearchUserResponse[]>(() => {
    const savedState = getTabState(PAGE_KEY, 'main');
    return savedState?.data?.allUsers || [];
  })
  const [loading, setLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 페이지 로딩 시 한 번만 유저 목록을 받아옴
  useEffect(() => {
    const fetchUsers = async () => {
      const savedState = getTabState(PAGE_KEY, 'main');
      if (savedState?.data?.allUsers && savedState.data.allUsers.length > 0) {
        // 저장된 데이터가 있으면 사용
        setAllUsers(savedState.data.allUsers);
        setSearchResults(savedState.data.searchResults || savedState.data.allUsers);
      } else {
        // 저장된 데이터가 없으면 새로 가져오기
        setLoading(true)
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/search`)
          const data = response.data.data;
          setAllUsers(data)  // 응답 데이터로 전체 유저 목록 저장
          setSearchResults(data)  // 검색결과에 초기 유저 목록을 그대로 설정
          
          // 상태 저장
          setTabState(PAGE_KEY, 'main', {
            activeTab: 'main',
            scrollPosition: 0,
            data: {
              allUsers: data,
              searchResults: data,
            },
          });
        } catch (error) {
          console.error('Error fetching users:', error)
          setSearchResults([])  // 오류 발생 시 빈 배열 설정
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUsers()
  }, [getTabState, setTabState]) // 컴포넌트가 마운트될 때 한 번만 실행

  // 페이지 마운트 시 스크롤 위치 복원
  useEffect(() => {
    const tabState = getTabState(PAGE_KEY, 'main');
    if (tabState?.scrollPosition) {
      setTimeout(() => {
        restoreScrollPosition(PAGE_KEY, 'main');
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  // 스크롤 위치 저장
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY || document.documentElement.scrollTop;
          saveScrollPosition(PAGE_KEY, 'main', scrollPos);
          savePageScrollPosition('/search', scrollPos);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [saveScrollPosition, savePageScrollPosition]);

  // 검색어가 변경될 때마다 결과를 필터링
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    let filteredResults: SearchUserResponse[];
    
    if (query.trim() === "") {
      filteredResults = allUsers;  // 검색어가 비어 있으면 전체 유저 목록 표시
    } else {
      filteredResults = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    setSearchResults(filteredResults);
    
    // 검색 상태 저장
    setTabState(PAGE_KEY, 'main', {
      activeTab: 'main',
      scrollPosition: 0, // 검색 시 스크롤 위치 초기화
      searchQuery: query,
      data: {
        allUsers: allUsers,
        searchResults: filteredResults,
      },
    });
  }

  return (
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername}/>
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-14 md:mb-0">
        <Header title="검색" loggedInUsername={loggedInUsername} />

        <div className="max-w-[640px] mx-auto px-4 py-4 mb-10" ref={scrollContainerRef}>
          <div className="relative mb-2">
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
