'use client';

import { Sidebar } from "@/components/sidebar";
import { Post } from "@/components/post";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import useLoggedInUsername from "@/hooks/useLoggedInUsername";
import { ThemeToggle } from "@/components/theme-toggle";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";

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

export default function Home() {
  const loggedInUsername = useLoggedInUsername(); // 로그인 중인 사용자 아이디를 가져옴

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [isFetching, setIsFetching] = useState(false); // 데이터 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [followingPosts, setFollowingPosts] = useState<PostResponse[]>([]);

  // 게시글 가져오기 (페이지네이션 적용)
  const fetchPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?page=${page}&size=10`, {
        withCredentials: true,
      });
      console.log(page)

      const newPosts = response.data.data;
      setPosts((prev) => [...prev, ...newPosts]); // 기존 게시글에 추가
      setPage((prev) => prev + 1); // 다음 페이지 증가
      setHasMore(newPosts.length > 0); // 데이터가 더 있는지 확인
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
    }
    setIsFetching(false);
  }, [isFetching, hasMore, page]);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/following/posts`, {
          withCredentials: true,
        });
        setFollowingPosts(response.data.data); // 게시물 배열
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchFollowingPosts();
  }, [])

  // Intersection Observer 설정 (마지막 게시글 감지)
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(); // 마지막 게시글이 보이면 다음 페이지 요청
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username={loggedInUsername} />

      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        {/* 메인 페이지 상단바 */}
        {/* <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"> */}
        <Header title="홈" loggedInUsername={loggedInUsername} />

        {/* 게시글 목록 */}
        <div className="max-w-[640px] mx-auto">
          <div className="divide-y">
            {loggedInUsername ? (
              <Tabs defaultValue="home">
              <TabsList className="w-full justify-start h-12 p-0 rounded-none sticky top-14 z-10 bg-background">
                <TabsTrigger
                  value="home"
                  className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  전체
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  팔로잉
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home" className="mt-0">
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
              <TabsContent value="following" className="mt-0">
                <div className="divide-y">
                  {followingPosts.map((post, index) => (
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
            </Tabs>
            ) : (
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
            )}
          </div>
          <div ref={observerRef} className="h-10" /> {/* 감지용 div */}
          {isFetching && <p className="text-center text-gray-500 py-4">로딩 중...</p>}
        </div>
      </main>
    </div>
  );
}
