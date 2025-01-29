'use client';

import { Sidebar } from "@/components/sidebar";
import { Post } from "@/components/post";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [isFetching, setIsFetching] = useState(false); // 데이터 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 로그인된 사용자의 세션을 조회
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
          withCredentials: true,
        });
        setLoggedInUsername(response.data.username);
      } catch (error) { }
    };
    checkSession();
  }, []);

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
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">홈</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {loggedInUsername ? (
              <Link href="/logout" prefetch={false} passHref>
                <Button>로그아웃</Button>
              </Link>
            ) : (
              <Link href="/login" passHref>
                <Button>로그인</Button>
              </Link>
            )}
          </div>
        </header>

        {/* 게시글 목록 */}
        <div className="max-w-[640px] mx-auto">
          <div className="divide-y">
            {posts.map((post, index) => (
              <Post
                key={post.postId}
                loggedInUsername={loggedInUsername}
                postId={post.postId}
                content={post.content}
                imageUrls={post.imageUrls}
                likes={post.likes}
                replies={post.replies}
                timeAgo={post.timeAgo}
                username={post.username}
                name={post.name}
                profileImageUrl={post.profileImageUrl}
                isLast={index === posts.length - 1}
              />
            ))}
          </div>
          <div ref={observerRef} className="h-10" /> {/* 감지용 div */}
          {isFetching && <p className="text-center text-gray-500 py-4">로딩 중...</p>}
        </div>
      </main>
    </div>
  );
}
