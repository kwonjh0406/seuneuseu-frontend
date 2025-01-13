"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X, AlertCircle } from 'lucide-react'
import { ImageCarousel } from "@/components/image-carousel"
import axios from "axios"

export default function CreatePage() {

  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  // 로그인 된 사용자의 세션을 조회, 존재한다면 사용자의 username(아이디)을 받아옴
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/username`, {
          withCredentials: true,
        });
        if (response.data.username == null) {
          window.location.href = "/login";
        }
        else {
          setLoggedInUsername(response.data.username);
        }
      } catch (error) {
        setLoggedInUsername(null);
      }
    };
    checkSession();
  }, []);

  const { postId } = useParams();

  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 500

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/edit/${postId}`, {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...newImageUrls])
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    router.push("/")
  }

  return (

    <div className="flex min-h-screen bg-background">
      <Sidebar username="asdf" />
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
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start a thread..."
                  className="min-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base p-0"
                  maxLength={maxLength}
                />
                {imageUrls.length > 0 && (
                  <ImageCarousel images={imageUrls}/>
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
            <p>Your thread will be visible on your profile and in your followers' feeds.</p>
            <p className="mt-2">You can add up to 4 photos to your thread.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

