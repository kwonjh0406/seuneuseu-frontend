import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentType {
  id: string
  username: string
  profileImageUrl: string
  timeAgo: string
  content: string
  likes: number
  parentId: string | null
}

interface CommentProps extends CommentType {
  replies: CommentType[]
  onReply: (commentId: string, content: string) => void
  isLast: boolean
}

export function Comment({
  id,
  username,
  profileImageUrl,
  timeAgo,
  content,
  replies,
  onReply,
  isLast
}: CommentProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const ReplyForm = ({ parentId }: { parentId: string }) => {
    const [replyContent, setReplyContent] = useState("")

    const handleSubmitReply = (e: React.FormEvent) => {
      e.preventDefault()
      onReply(parentId, replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }

    return (
      <form onSubmit={handleSubmitReply} className="mt-2 ml-12">
        <Textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="답글 작성하기..."
          className="min-h-[80px] resize-none"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setReplyingTo(null)}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={!replyContent.trim()}
          >
            게시
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 border bg-background">
          <AvatarImage src={profileImageUrl} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{username}</span>
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
          <p>{content}</p>
          <div className="flex items-center gap-4 pt-1">
            <button onClick={() => setReplyingTo(id)} className="text-sm text-muted-foreground hover:text-foreground">
              답글
            </button>
          </div>
        </div>
      </div>

      {replyingTo === id && <ReplyForm parentId={id} />}

      {replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="space-y-2">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={reply.profileImageUrl} />
                  <AvatarFallback>{reply.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{reply.username}</span>
                    <span className="text-sm text-muted-foreground">{reply.timeAgo}</span>
                  </div>
                  <p>{reply.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => setReplyingTo(reply.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      답글
                    </button>
                  </div>
                </div>
              </div>
              {replyingTo === reply.id && <ReplyForm parentId={id} />}
            </div>
          ))}
        </div>
      )}
      {!isLast && <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-accent" />}
    </div>
  )
}