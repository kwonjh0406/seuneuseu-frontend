"use client"
import { useEffect } from "react";
import axios from "axios";
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X } from 'lucide-react'

export default function CreatePage() {


const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/session", {
          withCredentials: true,  // 쿠키 전송
        });

        if (!response.data.isLoggedIn) {
          window.location.href = "/login";  // 세션이 없으면 로그인 페이지로 리다이렉트
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
        window.location.href = "/login";  // 세션 확인 실패 시 로그인 페이지로 리다이렉트
      }
    };

    checkSession();
  }, []);

  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 500

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    }
  }

  const removeImage = () => {
    setImageUrl(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the post data to your backend
    router.push("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">새 게시물</h1>
          <Button 
            disabled={!content.trim() && !imageUrl}
            onClick={handleSubmit}
          >
            게시
          </Button>
        </header>

        <div className="max-w-[640px] mx-auto">
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0 border bg-background">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start a thread..."
                  className="min-h-[150px] resize-none border-0 border-b rounded-none px-0 py-2 focus-visible:ring-0"
                  maxLength={maxLength}
                />

                {/* {imageUrl && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Image
                      src={imageUrl}
                      alt="Upload preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-6 w-6" />
                  </Button>

                  {content.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {content.length}/{maxLength}
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

