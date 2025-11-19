'use client'

import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { ProfileHeader } from "@/components/profile-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useParams } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"
import { useAppContext } from "@/lib/AppContext"
import { usePageScrollRestore } from "@/hooks/usePageScrollRestore"

interface PostResponseDto {
  postId: number;
  timeAgo: string;
  username: string;
  name: string;
  content: string;
  likes: number;
  replies: number;
  profileImageUrl: string;
  imageUrls: string[];
}

export default function ProfilePage() {
  const loggedInUsername = useLoggedInUsername();
  const { username } = useParams();
  const { getTabState, setTabState, saveScrollPosition, restoreScrollPosition, savePageScrollPosition, pageStates } = useAppContext();
  
  const PAGE_KEY = `profile-${username}`;
  
  // 탭별 상태 관리
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedState = getTabState(PAGE_KEY, 'post');
    return savedState?.activeTab || 'post';
  });
  
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [posts, setPosts] = useState<PostResponseDto[]>(() => {
    const savedState = getTabState(PAGE_KEY, 'post');
    return savedState?.data || [];
  });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/profile`, {
          withCredentials: true,
        });
        setUserProfile(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // 404는 사용자에게 알림 (존재하지 않는 사용자)
        }
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/posts`, {
          withCredentials: true,
        });
        const data = response.data.data;
        setPosts(data);
        
        // 상태 저장
        setTabState(PAGE_KEY, 'post', {
          activeTab: 'post',
          scrollPosition: 0,
          data: data,
        });
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // 게시글 로드 실패는 조용히 처리
      }
    };

    if (username) {
      const savedState = getTabState(PAGE_KEY, 'post');
      if (!savedState?.data || savedState.data.length === 0) {
        fetchPosts();
      }
    }
  }, [username, getTabState, setTabState]);

  // 스크롤 위치 저장
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY || document.documentElement.scrollTop;
          saveScrollPosition(PAGE_KEY, activeTab, scrollPos);
          // 페이지 레벨 스크롤 위치도 함께 저장
          const pathname = `/${username}`;
          savePageScrollPosition(pathname, scrollPos);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, saveScrollPosition, savePageScrollPosition, PAGE_KEY, username]);

  // 페이지 마운트 시 스크롤 위치 복원 (다른 페이지에서 돌아올 때)
  useEffect(() => {
    const tabState = getTabState(PAGE_KEY, activeTab);
    if (tabState?.scrollPosition) {
      // 탭별 스크롤 위치가 있으면 그것을 우선 사용
      setTimeout(() => {
        restoreScrollPosition(PAGE_KEY, activeTab);
      }, 150);
    } else {
      // 탭별 스크롤 위치가 없으면 페이지 레벨 스크롤 위치 사용
      const pathname = `/${username}`;
      const pageState = pageStates[pathname];
      if (pageState?.scrollPosition) {
        setTimeout(() => {
          window.scrollTo({ top: pageState.scrollPosition, behavior: 'auto' });
        }, 150);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  const handleTabChange = (value: string) => {
    // 현재 탭의 스크롤 위치 저장
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    saveScrollPosition(PAGE_KEY, activeTab, scrollPos);
    const pathname = `/${username}`;
    savePageScrollPosition(pathname, scrollPos);
    
    setActiveTab(value);
    
    // 새 탭의 스크롤 위치 복원
    setTimeout(() => {
      restoreScrollPosition(PAGE_KEY, value);
    }, 50);
  };

  return (
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-14 md:mb-0">
        <Header title={'@' + (userProfile?.username || '')} loggedInUsername={loggedInUsername} />

        <div className="max-w-[640px] mx-auto" ref={scrollContainerRef}>
          <ProfileHeader {...userProfile} loggedInUsername={loggedInUsername} />
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start h-12 p-0 border-b rounded-none sticky top-14 z-10 bg-background/90 backdrop-blur-md">
              <TabsTrigger
                value="post"
                className="!bg-transparent flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                게시물
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="!bg-transparent flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                갤러리
              </TabsTrigger>
            </TabsList>
            <TabsContent value="post" className="mt-0 mb-10">
              <div className="divide-y">
                {posts.map((post, index) => (
                  <Post
                    key={post.postId}
                    postId={post.postId}
                    loggedInUsername={loggedInUsername}
                    profileImageUrl={post.profileImageUrl}
                    timeAgo={post.timeAgo}
                    username={post.username}
                    name={post.name}
                    content={post.content}
                    imageUrls={post.imageUrls}
                    likes={post.likes}
                    replies={post.replies}
                    isLast={index === posts.length - 1}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="mt-0 mb-24">
              <Gallery username={username as string} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
