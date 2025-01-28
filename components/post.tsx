import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import Link from "next/link"
import axios from "axios"
import { ImageGallery } from "./image-garllery"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

interface PostProps {
  loggedInUsername: string | null
  postId: number
  name: string
  profileImageUrl: string
  timeAgo: string
  content: string
  imageUrls?: string[]
  likes: number
  username: string
  replies: number
  isLast: boolean
}

export function Post({
  loggedInUsername,
  postId,
  name,
  profileImageUrl,
  timeAgo,
  content,
  imageUrls,
  likes,
  username,
  replies,
  isLast
}: PostProps) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        window.location.reload();
      } else {
        console.error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setIsDeleteDialogOpen(false)
  };

  return (
    <div className="relative flex gap-4 p-3 md:px-4 md:py-4 bg-card group hover:bg-accent/5 transition-colors">
      {/* <div className="relative flex gap-4 px-6 py-4 bg-card group hover:bg-accent/5 transition-colors max-w-full overflow-x-auto"> */}
      {/* Avatar column with connecting line */}

      <div className="relative flex flex-col items-center">
        <Link href={`/${username}`} passHref>
          <Avatar className="h-10 w-10 shrink-0 border bg-background">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        {!isLast && (
          <div className="w-0.5 grow mt-2 bg-accent" />
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/${username}`} passHref><span className="font-semibold truncate">{name}</span></Link>
            {/* <Link href={`/${username}`} passHref><span className="text-muted-foreground shrink-0">@{username}</span></Link> */}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">{timeAgo}</span>
          </div>

          {/* 로그인된 사용자 본인 게시물을 수정/삭제 버튼 활성화 */}
          {loggedInUsername === username && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0">
                <Link href={`/post/edit/${postId}`} passHref><Button variant="ghost" className="w-full justify-start">
                  수정
                </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-destructive dark:text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
                  삭제
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <p className="mt-0.5 text-[0.9375rem] break-all whitespace-pre-wrap">
          {content}
        </p>

        {imageUrls && imageUrls.length > 0 && (
          <div className="mt-3">
            <ImageGallery images={imageUrls} />
          </div>
        )}

        <div className="flex gap-4 mt-3">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <Heart className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{likes}</span>
          </button>
          <Link href={`/post/${postId}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group/button">
            <div className="p-2 -m-2 rounded-full group-hover/button:bg-primary/10">
              <MessageCircle className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{replies}</span>
          </Link>
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] max-w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>정말로 이 게시글을 삭제하시겠습니까?</DialogDescription>
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

