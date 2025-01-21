import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

      <p className="mt-4 text-sm whitespace-pre-wrap">{bio}</p>

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
          <>
            <Button variant="default" className="flex-1">로그인</Button>
            <Button className="flex-1">프로필 편집</Button>
          </>
        )}
      </div>
    </div>
  )
}

