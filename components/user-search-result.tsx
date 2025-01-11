import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserSearchResultProps {
  username: string
  name: string
  avatar: string
  bio: string
  isFollowing: boolean
  onFollow: () => void
}

export function UserSearchResult({
  username,
  name,
  avatar,
  bio,
  isFollowing,
  onFollow
}: UserSearchResultProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={onFollow}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
        <p className="text-sm mt-1 truncate">{bio}</p>
      </div>
    </div>
  )
}

