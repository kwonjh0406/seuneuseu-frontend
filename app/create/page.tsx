"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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

  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 500

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/api/post", // 실제 게시글 작성 API 엔드포인트
  //       { content },
  //       {
  //         withCredentials: true, // 쿠키를 포함하여 인증 정보를 전송
  //         headers: {
  //           "Content-Type": "application/json", // JSON 데이터로 전송
  //         },
  //       }
  //     );

  //     // 성공적으로 게시글이 작성된 경우
  //     alert(response.data.message);  // 응답 메시지
  //   } catch (error) {
  //     // 에러 처리
  //     console.error("게시글 작성 실패:", error);
  //     alert("게시글 작성에 실패했습니다.");
  //   }
  //   router.push("/")
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("content", content); // 텍스트 데이터 추가
  
      // 파일 추가
      if (fileInputRef.current?.files) {
        Array.from(fileInputRef.current.files).forEach((file) => {
          formData.append("images", file); // 다중 이미지 업로드
        });
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Multipart 전송
          },
        }
      );
  
      alert(response.data.message);
      router.push("/");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };
  
  

  return (

    <div className="flex min-h-screen bg-background">
      <Sidebar username="asdf" />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">새 게시물</h1>
          <Button
            disabled={!content.trim() && imageUrls.length === 0}
            onClick={handleSubmit}
          >
            게시
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
                  <ImageCarousel images={imageUrls} onRemove={removeImage} />
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
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
                      <ImageIcon className="h-5 w-5" />
                    </Button>
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

