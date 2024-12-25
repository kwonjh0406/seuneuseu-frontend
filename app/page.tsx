'use client';

import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import axios from "axios";

const posts = [
  {
    username: "thepoetnotarockstar",
    avatar: "/placeholder.svg",
    timeAgo: "15h",
    content: `"When I was a Beatle I thought we were the best fucking group in the world, and believing that is what made us what we were."

— John Lennon`,
    image: "/placeholder.svg?height=400&width=600",
    likes: 13,
    replies: 2,
    reposts: 1
  },
  {
    username: "ayodebaba",
    avatar: "/placeholder.svg",
    timeAgo: "15h",
    content: "One thing I have learnt in this life is embracing my flaws. Those who remain in my life choose me genuinely because my flaws have no value to them.",
    likes: 3,
    replies: 0,
    reposts: 1
  },
  {
    username: "kristinmallison",
    avatar: "/placeholder.svg",
    timeAgo: "10h",
    content: "Working on another sparkly mini dress ✨⭐️",
    image: "/placeholder.svg?height=400&width=600",
    likes: 5,
    replies: 1,
    reposts: 0
  }
]

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/session", {
          withCredentials: true, // 쿠키 전송
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error("세션 확인 실패:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">홈</h1>
          {isLoggedIn ? (
            <Button variant="outline" size="sm" className="h-8 px-4">
              Log out
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-8 px-4">
              Log in
            </Button>
          )}
        </header>
        <div className="max-w-[640px] mx-auto">
          <div className="divide-y">
            {posts.map((post, index) => (
              <Post 
                key={index} 
                {...post} 
                isLast={index === posts.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

