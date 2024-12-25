import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PostProps {
  username: string
  avatar: string
  timeAgo: string
  content: string
  image?: string
  likes: number
  replies: number
  reposts: number
  isLast?: boolean
}

export function Post({
  username,
  avatar,
  timeAgo,
  content,
  image,
  likes,
  replies,
  reposts,
  isLast
}: PostProps) {
  return (
    <div className="relative flex gap-4 px-6 py-4 bg-card group hover:bg-accent/5 transition-colors">
      {/* Avatar column with connecting line */}
      <div className="relative flex flex-col items-center">
        <Avatar className="h-10 w-10 shrink-0 border bg-background">
          <AvatarImage src={avatar} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        {!isLast && (
          <div className="w-0.5 grow mt-2 bg-accent" />
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">{username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">{timeAgo}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <p className="mt-0.5 text-[0.9375rem] whitespace-pre-wrap break-words">{content}</p>

        {image && (
          <div className="relative mt-3 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src={image}
              alt="Post image"
              fill
              className="object-cover hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        <div className="flex gap-4 mt-3">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <Heart className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <MessageCircle className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{replies}</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <Repeat2 className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{reposts}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

