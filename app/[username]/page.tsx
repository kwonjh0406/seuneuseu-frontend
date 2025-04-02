'use client'

import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { ProfileHeader } from "@/components/profile-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"

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

 
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [posts, setPosts] = useState<PostResponseDto[]>([]);

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
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-14 md:mb-0">
        <Header title={'@' + userProfile?.username} loggedInUsername={loggedInUsername} />

        <div className="max-w-[640px] mx-auto">
          <ProfileHeader {...userProfile} loggedInUsername={loggedInUsername} />
          
          <Tabs defaultValue="post">
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
              <Gallery username={username} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

