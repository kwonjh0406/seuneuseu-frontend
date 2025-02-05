'use client'

import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { ProfileHeader } from "@/components/profile-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation";
import Link from "next/link";
import { Gallery } from "@/components/gallery";

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
  const { username } = useParams();

  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [posts, setPosts] = useState<PostResponseDto[]>([]);

  // 로그인 된 사용자의 세션을 조회, 존재한다면 사용자의 user_id 값을 받아옴
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
          withCredentials: true,
        });
        setLoggedInUsername(response.data.username);
      } catch (error) {
        setLoggedInUsername(null);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/profile`, {
          withCredentials: true,
        });
        setUserProfile(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
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
        setPosts(response.data.data); // 게시물 배열
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{'@' + userProfile?.username || "Unknown User"}</h1>
          </div>
          {loggedInUsername ? (
            <Link href="/logout" prefetch={false} passHref>
              <Button>로그아웃</Button>
            </Link>
          ) : (
            <Link href="/login" passHref>
              <Button>로그인</Button>
            </Link>
          )}
        </header>

        <div className="max-w-[640px] mx-auto">
          <ProfileHeader {...userProfile} loggedInUsername={loggedInUsername} />
          
          <Tabs defaultValue="threads" className="mt-4">
            <TabsList className="w-full justify-start h-12 p-0 rounded-none sticky top-14 z-10 bg-background">
              <TabsTrigger
                value="threads"
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                게시물
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                갤러리
              </TabsTrigger>
            </TabsList>
            <TabsContent value="threads" className="mt-0">
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
            <TabsContent value="gallery" className="mt-0">
              <Gallery username={username} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

