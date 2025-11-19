"use client";

import { Sidebar } from "@/components/sidebar";
import { Post } from "@/components/post";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import useLoggedInUsername from "@/hooks/useLoggedInUsername";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { PostSkeleton } from "@/components/post-skeleton";
import { useAppContext } from "@/lib/AppContext";
import { usePageScrollRestore } from "@/hooks/usePageScrollRestore";

interface PostResponse {
  postId: number;
  content: string;
  imageUrls: string[];
  likes: number;
  replies: number;
  timeAgo: string;
  username: string;
  name: string;
  profileImageUrl: string;
}

const PAGE_KEY = 'home';

export default function Home() {
  const loggedInUsername = useLoggedInUsername();
  const { getTabState, setTabState, saveScrollPosition, restoreScrollPosition, savePageScrollPosition, restorePageScrollPosition, pageStates } = useAppContext();
  
  // 탭별 상태 관리
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedState = getTabState(PAGE_KEY, 'home');
    return savedState?.activeTab || 'home';
  });
  
  const [posts, setPosts] = useState<PostResponse[]>(() => {
    const savedState = getTabState(PAGE_KEY, 'home');
    return savedState?.data || [];
  });
  
  const [followingPosts, setFollowingPosts] = useState<PostResponse[]>(() => {
    const savedState = getTabState(PAGE_KEY, 'following');
    return savedState?.data || [];
  });
  
  const [page, setPage] = useState(() => {
    const savedState = getTabState(PAGE_KEY, 'home');
    return savedState?.data?.length ? Math.floor(savedState.data.length / 10) : 0;
  });
  
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (reset = false) => {
    if (isFetching || (!hasMore && !reset)) return;

    setIsFetching(true);
    try {
      const currentPage = reset ? 0 : page;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?page=${currentPage}&size=10`,
        {
          withCredentials: true,
        }
      );

      const newPosts = response.data.data;
      setPosts((prevPosts) => {
        let updatedPosts: PostResponse[];
        if (reset) {
          updatedPosts = newPosts;
          setPage(1);
        } else {
          updatedPosts = [...prevPosts, ...newPosts];
          setPage((prev) => prev + 1);
        }
        
        // 상태 저장
        setTabState(PAGE_KEY, 'home', {
          activeTab: 'home',
          scrollPosition: 0,
          data: updatedPosts,
        });
        
        return updatedPosts;
      });
      setHasMore(newPosts.length > 0);
      setIsInitialLoading(false);
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setHasMore(false);
      setIsInitialLoading(false);
      // 사용자에게 에러 알림은 하지 않음 (무한 스크롤이므로)
    }
    setIsFetching(false);
  }, [isFetching, hasMore, page, setTabState]);

  const fetchFollowingPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/following/posts`,
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;
      setFollowingPosts(data);
      
      // 상태 저장
      setTabState(PAGE_KEY, 'following', {
        activeTab: 'following',
        scrollPosition: 0,
        data: data,
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // 팔로잉 게시글 로드 실패는 조용히 처리
    }
  }, [setTabState]);

  // 초기 로드
  useEffect(() => {
    const savedState = getTabState(PAGE_KEY, 'home');
    if (!savedState?.data || savedState.data.length === 0) {
      fetchPosts(true);
    } else {
      setIsInitialLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 팔로잉 게시글 로드
  useEffect(() => {
    if (loggedInUsername) {
      const savedState = getTabState(PAGE_KEY, 'following');
      if (!savedState?.data || savedState.data.length === 0) {
        fetchFollowingPosts();
      }
    }
  }, [loggedInUsername, fetchFollowingPosts, getTabState]);

  // 스크롤 위치 저장 (스크롤 이벤트) - 탭별로 저장
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY || document.documentElement.scrollTop;
          saveScrollPosition(PAGE_KEY, activeTab, scrollPos);
          // 페이지 레벨 스크롤 위치도 함께 저장 (다른 페이지에서 돌아올 때 사용)
          savePageScrollPosition('/', scrollPos);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, saveScrollPosition, savePageScrollPosition]);

  // 무한 스크롤
  useEffect(() => {
    if (!observerRef.current || !hasMore || activeTab !== 'home') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore, activeTab]);

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
      const pageState = pageStates['/'];
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
    savePageScrollPosition('/', scrollPos);
    
    setActiveTab(value);
    
    // 새 탭의 스크롤 위치 복원
    setTimeout(() => {
      restoreScrollPosition(PAGE_KEY, value);
    }, 50);
  };

  const renderPosts = (postsToRender: PostResponse[]) => {
    if (isInitialLoading && postsToRender.length === 0) {
      return Array(5)
        .fill(0)
        .map((_, index) => <PostSkeleton key={index} />);
    }

    if (postsToRender.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          게시글이 없습니다.
        </div>
      );
    }

    return postsToRender.map((post, index) => (
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
        isLast={index === postsToRender.length - 1}
      />
    ));
  };

  return (
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername} />

      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-14 md:mb-0">
        <Header title="홈" loggedInUsername={loggedInUsername} />

        <div className="max-w-[640px] mb-5 mx-auto" ref={scrollContainerRef}>
          {loggedInUsername ? (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full justify-start h-12 p-0 rounded-none sticky border-b top-14 z-10 bg-background/90 backdrop-blur-md">
                <TabsTrigger
                  value="home"
                  className="!bg-transparent flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  전체
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="!bg-transparent flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  팔로잉
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home" className="mt-0">
                <div className="divide-y">{renderPosts(posts)}</div>
              </TabsContent>
              <TabsContent value="following" className="mt-0">
                <div className="divide-y">{renderPosts(followingPosts)}</div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="divide-y">{renderPosts(posts)}</div>
          )}
          {activeTab === 'home' && <div ref={observerRef} className="h-5" />}
          {isFetching && !isInitialLoading && <PostSkeleton />}
        </div>
      </main>
    </div>
  );
}
