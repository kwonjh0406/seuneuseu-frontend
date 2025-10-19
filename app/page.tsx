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
import { PostSkeleton } from "@/components/post-skeleton";

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
  const loggedInUsername = useLoggedInUsername();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [followingPosts, setFollowingPosts] = useState<PostResponse[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?page=${page}&size=10`, {
        withCredentials: true,
      });

      const newPosts = response.data.data;
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      setHasMore(newPosts.length > 0);
      setIsInitialLoading(false);
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setHasMore(false);
      setIsInitialLoading(false);
    }
    setIsFetching(false);
  }, [isFetching, hasMore, page]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/following/posts`, {
          withCredentials: true,
        });
        setFollowingPosts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    if (loggedInUsername) {
      fetchFollowingPosts();
    }
  }, [loggedInUsername]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

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
  }, [fetchPosts, hasMore]);

  const renderPosts = (postsToRender: PostResponse[]) => {
    if (isInitialLoading) {
      return Array(5).fill(0).map((_, index) => <PostSkeleton key={index} />);
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

        <div className="max-w-[768px] mb-5 mx-auto">
          {loggedInUsername ? (
            <Tabs defaultValue="home">
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
                <div className="divide-y">
                  {renderPosts(posts)}
                </div>
              </TabsContent>
              <TabsContent value="following" className="mt-0">
                <div className="divide-y">
                  {renderPosts(followingPosts)}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="divide-y">
              {renderPosts(posts)}
            </div>
          )}
          <div ref={observerRef} className="h-5"/>
          {isFetching && !isInitialLoading && <PostSkeleton />}
        </div>
      </main>
    </div>
  );
}
