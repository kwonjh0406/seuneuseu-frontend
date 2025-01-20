"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { Comment } from "@/components/comment"
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

interface CommentType {
  id: string
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
  replies: ReplyType[]
}

// Mock data (in a real app, you'd fetch this from an API)
const mockPost = {
  id: "1",
  username: "johndoe",
  avatar: "/placeholder.svg",
  timeAgo: "2h",
  content: "This is a sample post content. What do you think?",
  likes: 10,
  replies: 3,
  profileImageUrl: "asdf",
  loggedInUsername: "asdf",
  postId: 1,
  name: "qfew"
}

const mockComments: CommentType[] = [
  {
    id: "1",
    username: "janedoe",
    avatar: "/placeholder.svg",
    timeAgo: "1h",
    content: "Great post! I totally agree.",
    likes: 5,
    replies: [
      {
        id: "1-1",
        username: "bobsmith",
        avatar: "/placeholder.svg",
        timeAgo: "30m",
        content: "I agree with Jane!",
        likes: 2,
      },
    ],
  },
  {
    id: "2",
    username: "alicegreen",
    avatar: "/placeholder.svg",
    timeAgo: "45m",
    content: "Interesting perspective. Thanks for sharing!",
    likes: 3,
    replies: [],
  },
]

export default function PostPage() {
  const params = useParams()
  const postId = params.id as string
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState(mockComments)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    const newComment: CommentType = {
      id: String(comments.length + 1),
      username: "currentuser",
      avatar: "/placeholder.svg",
      timeAgo: "Just now",
      content: commentContent,
      likes: 0,
      replies: [],
    }
    setComments([newComment, ...comments])
    setCommentContent("")
    
    // In a real application, you would send a request to your API here
    console.log("Submitting comment for postId:", postId)
  }

  const handleReply = (commentId: string, replyContent: string, replyToReplyId?: string) => {
    const newReply: ReplyType = {
      id: `${commentId}-${Date.now()}`,
      username: "currentuser",
      avatar: "/placeholder.svg",
      timeAgo: "Just now",
      content: replyContent,
      likes: 0,
    }
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        }
      }
      return comment
    })
    
    setComments(updatedComments)
    
    // In a real application, you would send a request to your API here
    console.log("Submitting reply for postId:", postId, "commentId:", commentId, "replyToReplyId:", replyToReplyId)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username="asdf"/>
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">게시물</h1>
        </header>

        <div className="max-w-[640px] mx-auto px-4 py-6 bg-background/80 backdrop-blur-sm">
          <Post {...mockPost} />

          <div className="my-6 border-t border-border" />

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4">댓글</h2>
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-3">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px] resize-none border-none bg-muted focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!commentContent.trim()} size="sm">
                      작성
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment 
                  key={comment.id} 
                  {...comment} 
                  onReply={handleReply}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

