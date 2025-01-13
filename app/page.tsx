'use client';

import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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

  // 로그인 된 사용자의 세션을 조회, 존재한다면 사용자의 username(아이디)을 받아옴
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/username`, {
          withCredentials: true,
        });
        setLoggedInUsername(response.data.username);
      } catch (error) {
        setLoggedInUsername(null);
      }
    };
    checkSession();
  }, []);

  // 게시글 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
          withCredentials: true,
        });
        setPosts(response.data); // PostResponseDto의 배열
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
      }
    };

    fetchPosts(); // 게시글 가져오기
  }, []);


  return (
    <div className="flex min-h-screen bg-background">

      {/* 사이드바 컴포넌트 호출 + 로그인된 유저 이름 전달 (사이드바의 프로필 버튼 누를 때 유저이름을 url 경로에 주기 위함) */}
      <Sidebar username={loggedInUsername} />

      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">

        {/* 메인 페이지 상단바 */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">홈</h1>
          {loggedInUsername ? (
            <Link href="/logout" passHref>
              <Button>로그아웃</Button>
            </Link>
          ) : (
            <Link href="/login" passHref>
              <Button>로그인</Button>
            </Link>
          )}
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
        </div>
      </main>
    </div>
  )
}
