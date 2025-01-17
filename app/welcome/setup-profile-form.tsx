"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Camera } from 'lucide-react'
import axios from "axios"

export default function SetupProfileForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    try {
      // Dynamically import the libraries only when needed (client-side)
      const [{ default: imageCompression }, { heicTo }] = await Promise.all([
        import('browser-image-compression'),
        import('heic-to')
      ])

      let processedFile = file
      const originalFileName = file.name
      
      if (file.type === "image/heic" || file.type === "image/heif") {
        const blob = await heicTo({
          blob: file,
          type: "image/jpeg",
        })
        processedFile = new File([blob], originalFileName.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        })
      }
  
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg'
      }
  
      const compressedBlob = await imageCompression(processedFile, options)
      
      const finalFile = new File(
        [compressedBlob], 
        processedFile.name,
        { type: 'image/jpeg' }
      )
      
      return finalFile
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error)
      throw error
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const processed = await processImage(file)
        setProcessedImage(processed)
        const previewUrl = URL.createObjectURL(processed)
        setAvatarUrl(previewUrl)
      } catch (error) {
        alert('이미지 처리 중 오류가 발생했습니다.')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('username', username)
    formData.append('name', name)

    if (processedImage) {
      formData.append('profileImage', processedImage)
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/welcome-profile-setup`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      router.push('/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(error.response.data.message || "오류가 발생했습니다.")
        }
      }
    }
  }

  return (
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
        <Label htmlFor="username">사용자 아이디</Label>
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
          placeholder="한글과 영어만 입력 가능"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        프로필 설정 마치기
      </Button>
    </form>
  )
}

