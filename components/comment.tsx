import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReplyType {
  id: string
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
}

interface CommentProps {
  id: string
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
  replies: ReplyType[]
  onReply: (commentId: string, replyContent: string, replyToReplyId?: string) => void
}

export function Comment({ id, username, avatar, timeAgo, content, likes, replies, onReply }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitReply = (e: React.FormEvent, replyToReplyId?: string) => {
    e.preventDefault()
    onReply(id, replyContent, replyToReplyId)
    setReplyContent("")
    setIsReplying(false)
    setReplyingTo(null)
  }

  const handleReplyClick = (replyId?: string) => {
    setIsReplying(true)
    setReplyingTo(replyId || null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={avatar} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{username}</span>
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
          <p>{content}</p>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => handleReplyClick()} className="text-muted-foreground hover:text-foreground">
              Reply
            </button>
          </div>
        </div>
      </div>

      {isReplying && replyingTo === null && (
        <form onSubmit={(e) => handleSubmitReply(e)} className="ml-12 mt-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px] resize-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!replyContent.trim()}>
              Reply
            </Button>
          </div>
        </form>
      )}

      {replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="space-y-2">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={reply.avatar} />
                  <AvatarFallback>{reply.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{reply.username}</span>
                    <span className="text-sm text-muted-foreground">{reply.timeAgo}</span>
                  </div>
                  <p>{reply.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="text-muted-foreground hover:text-foreground">Like ({reply.likes})</button>
                    <button onClick={() => handleReplyClick(reply.id)} className="text-muted-foreground hover:text-foreground">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
              {isReplying && replyingTo === reply.id && (
                <form onSubmit={(e) => handleSubmitReply(e, reply.id)} className="ml-10 mt-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsReplying(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!replyContent.trim()}>
                      Reply
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

