import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
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
      window.location.reload()
    } catch (error) {
      setIsDeleteDialogOpen(false);
      if (axios.isAxiosError(error)) {
        if (error.response) alert(error.response.data.message)
      }
    }
  }

  return (
    <Card className="my-2 mx-2">
      <CardHeader className="p-0 pb-0">
        <div className="flex items-start w-full">
          {/* 프로필 링크를 좌측 영역으로 제한 */}
          <Link href={`/${username}`} className="flex items-start pl-4 pt-4 flex-1">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profileImageUrl} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <span className="font-semibold">{name}</span>
                <p className="text-sm text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
          </Link>

          {/* Popover는 링크 밖으로 둬서 클릭 이벤트가 정상 동작하게 함 */}
          {loggedInUsername === username && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-16 w-16"
                >
                  <MoreHorizontal className="h-16 w-16" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0">
                <Link href={`/post/edit/${postId}`} passHref>
                  <Button variant="ghost" className="w-full justify-start">수정</Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  삭제
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <Link href={`/post/${postId}`} passHref>
          <p className="whitespace-pre-wrap">{content}</p>
        </Link>

        {imageUrls && imageUrls.length > 0 && (
          <div className="mt-3">
            <ImageGallery images={imageUrls} />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-4">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <div className="p-2 -m-2 rounded-full hover:bg-primary/10">
              <Heart className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{likes}</span>
          </button>
          <Link 
            href={`/post/${postId}`} 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="p-2 -m-2 rounded-full hover:bg-primary/10">
              <MessageCircle className="w-[1.125rem] h-[1.125rem]" />
            </div>
            <span className="text-sm">{replies}</span>
          </Link>
        </div>
      </CardFooter>

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
    </Card>
  )
}

