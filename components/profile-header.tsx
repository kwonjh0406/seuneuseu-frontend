'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import axios from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface ProfileHeaderProps {
  username: string
  name: string
  profileImageUrl: string
  bio: string
  follower: string
  following: string
  createdAt: string
  loggedInUsername: string
}

export function ProfileHeader({
  username,
  name,
  profileImageUrl,
  bio,
  follower,
  following,
  createdAt,
  loggedInUsername
}: ProfileHeaderProps) {

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/follow`, {
          withCredentials: true,
        });
        setIsFollowing(response.data.data.follow);
      } catch (error) {
        console.error("팔로우 상태 확인 실패:", error);
      }
    };
    checkFollowStatus();
  }, [username]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/follow`, {}, {
        withCredentials: true,
      });
      setIsFollowing(true);
    } catch (error) {
    }
  };

  const handleUnFollow = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/follow`, {
        withCredentials: true,
      });
      setIsFollowing(false);
    } catch (error) {
    }
  };


  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold">{name}</h2>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>@{username}</span>
          </div>
        </div>
        <Avatar className="h-20 w-20 border-2">
          <AvatarImage src={profileImageUrl} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      </div>

      <p className="mt-4 text-sm break-all whitespace-pre-wrap">
        {bio}
      </p>

      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <span>팔로워 {follower}명</span>
        <span>팔로잉 {following}명</span>
      </div>

      <div className="flex gap-2 mt-4">
        {loggedInUsername === username ? (
          <Link href="/profile/edit" passHref className="flex-1 w-full">
            <Button variant="outline" className="w-full">프로필 편집</Button>
          </Link>
        ) : (
          isFollowing === null ? (
            <Link href="/login" passHref className="flex-1 w-full" prefetch={false}><Button className="w-full">팔로우</Button></Link>
          ) : isFollowing ? (
            <Button variant="outline" className="flex-1 w-full" onClick={handleUnFollow}>팔로우 취소</Button>
          ) : (
            <Button className="flex-1 w-full" onClick={handleFollow}>팔로우</Button>
          )
        )}
      </div>
    </div>
  )
}

