import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentProps {
  id: string
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
  replies?: CommentProps[]
  onReply: (commentId: string, content: string) => void
}

export function Comment({
  id,
  username,
  avatar,
  timeAgo,
  content,
  likes,
  replies,
  onReply
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleReply = () => {
    onReply(id, replyContent)
    setReplyContent("")
    setIsReplying(false)
  }

  return (
    <div className="relative flex gap-3 py-4 group">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={avatar} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{username}</span>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>

        <p className="text-sm mb-3 leading-relaxed">{content}</p>

        <div className="flex gap-4 mt-3">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <Heart className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{likes}</span>
          </button>
          <button 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button"
            onClick={() => setIsReplying(!isReplying)}
          >
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <MessageCircle className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">Reply</span>
          </button>
        </div>

        {isReplying && (
          <div className="mt-3 pl-3 border-l-2 border-muted">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px] text-sm resize-none border-none bg-muted focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="mt-4 pl-4 border-l border-border">
            {replies.map((reply) => (
              <Comment key={reply.id} {...reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

