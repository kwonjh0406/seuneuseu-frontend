import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface UserSearchResultProps {
  username: string
  name: string
  profileImageUrl: string
}

export function UserSearchResult({
  username,
  name,
  profileImageUrl,
}: UserSearchResultProps) {
  return (
    <Link href={`/${username}`}>
      <div className="flex items-center gap-4 py-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profileImageUrl} />
          <AvatarFallback>
            <img src="https://www.gravatar.com/avatar/?d=mp" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">{name}</h3>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

