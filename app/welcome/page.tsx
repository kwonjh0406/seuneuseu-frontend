"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Camera } from 'lucide-react'

export default function SetupProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // FormData 객체 생성
    const formData = new FormData()
  
    // 사용자 이름과 이름을 FormData에 추가
    formData.append('username', username)
    formData.append('name', name)
  
    // 이미지 파일이 존재하면 FormData에 이미지 파일을 추가
    if (fileInputRef.current?.files?.[0]) {
      formData.append('profileImage', fileInputRef.current.files[0])
    }
  
    try {
      // 백엔드 API에 데이터 전송
      const response = await fetch('/api/welcome-profile-setup', {
        credentials: 'include', //시발
        method: 'POST',
        body: formData,
      })
 
      const responseData = await response.json();
  
      if (responseData.success) {
        router.push('/')
      } else {
        // 서버에서 에러가 발생했을 경우
        console.error(responseData.message)
      }
    } catch (error) {
      console.error('Error submitting profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">환영합니다!</h1>
          <p className="text-muted-foreground mt-2">프로필 설정을 마치고 서비스를 이용해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile picture" />
                ) : (
                  <AvatarFallback>
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">사용자 이름</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="영어, 숫자, 밑줄 및 마침표만 입력 가능"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            프로필 설정 마치기
          </Button>
        </form>
      </div>
    </div>
  )
}
