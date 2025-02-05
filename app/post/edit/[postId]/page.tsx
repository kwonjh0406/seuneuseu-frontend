"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X, AlertCircle } from 'lucide-react'
import { ImageCarousel } from "@/components/image-carousel2"
import axios from "axios"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"

export default function CreatePage() {
  const loggedInUsername = useLoggedInUsername();

  const { postId } = useParams();
  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const maxLength = 500

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/edit/${postId}`, {
          withCredentials: true,
        })
        const { content, images } = response.data.data
        setContent(content || "")
        setImageUrls(images || [])
      } catch (error) {
        console.error("Failed to fetch post data:", error)
      }
    }

    fetchPostData()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`,
        { content },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Content-Type 명시
          },
        }
      );
      router.push("/"); // 수정 완료 후 메인 페이지로 이동
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(error.response.data.message || "오류가 발생했습니다.")
        }
      }
    }
  };


  return (

    <div className="flex min-h-screen bg-background">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">게시글 수정</h1>
          <Button
            disabled={!content.trim() && imageUrls.length === 0}
            onClick={handleSubmit}
          >
            수정
          </Button>
        </header>

        <div className="max-w-[640px] mx-auto p-4">
          <div className="bg-card rounded-lg p-3">
            <div className="flex items-start space-x-4">
              <div className="flex-1 min-w-0 space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base p-0"
                  maxLength={maxLength}
                />
                {imageUrls.length > 0 && (
                  <ImageCarousel images={imageUrls} />
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">

                    {content.length > maxLength * 0.8 && (
                      <div className="flex items-center text-amber-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{maxLength - content.length} characters left</span>
                      </div>
                    )}
                  </div>
                  {content.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {content.length}/{maxLength}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>사진은 수정할 수 없습니다.</p>
            <p className="mt-2">게시물의 내용은 최대 500자까지 작성할 수 있습니다.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

