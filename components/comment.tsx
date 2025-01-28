import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import Link from "next/link"

interface CommentType {
  id: string
  username: string
  profileImageUrl: string
  timeAgo: string
  content: string
  likes: number
  name: string
  parentId: string | null
}

interface CommentProps extends CommentType {
  replies: CommentType[]
  onReply: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  isLast: boolean
  loggedInUsername: string | null
}

export function Comment({
  loggedInUsername,
  id,
  username,
  name,
  profileImageUrl,
  timeAgo,
  content,
  replies,
  onReply,
  onDelete,
  isLast
}: CommentProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; isReply: boolean } | null>(null);


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

  const handleDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.isReply) {
        console.log("delete reply " + deleteTarget.id);
        onDelete(deleteTarget.id); // 답글 삭제
      } else {
        console.log("delete parent comment " + deleteTarget.id);
        onDelete(deleteTarget.id); // 부모 댓글 삭제
      }
    }
    setIsDeleteDialogOpen(false);
  };


  return (
    <div className="space-y-4 relative">
      <div className="flex gap-3">
        <Link href={`/${username}`} passHref>
          <Avatar className="h-10 w-10 shrink-0 border bg-background">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/${username}`} passHref><span className="font-semibold truncate">{name}</span></Link>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{timeAgo}</span>


          </div>
          <p>{content}</p>
          <div className="flex items-center gap-4 pt-1">
            <button onClick={() => setReplyingTo(id)} className="text-sm text-muted-foreground hover:text-foreground">
              답글
            </button>
            {loggedInUsername === username && (
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                  setDeleteTarget({ id, isReply: false }); // 부모 댓글 삭제 대상 설정
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                삭제
              </button>
            )}
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
                    {loggedInUsername === username && (
                      <button
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setDeleteTarget({ id: reply.id, isReply: true }); // 답글 삭제 대상 설정
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {replyingTo === reply.id && <ReplyForm parentId={id} />}
            </div>
          ))}
        </div>
      )}
      {!isLast && <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-accent" />}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] max-w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle>댓글 삭제</DialogTitle>
            <DialogDescription>정말로 이 댓글을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="sm:w-auto w-full">
                취소
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="sm:w-auto w-full">
                삭제
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}