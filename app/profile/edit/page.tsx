"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Camera, ImageIcon, Loader2 } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<File | null>(null)

  // 초기 상태를 저장할 변수 추가
const [initialProfile, setInitialProfile] = useState({
  name: "",
  username: "",
  bio: "",
  avatarUrl: "",
})

useEffect(() => {
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/profile`, {
        withCredentials: true,
      })
      const { data } = response.data
      const profileData = {
        name: data.name || "",
        username: data.username || "",
        bio: data.bio || "",
        avatarUrl: data.profileImageUrl || "/placeholder.svg",
      }
      setInitialProfile(profileData)
      setName(profileData.name)
      setUsername(profileData.username)
      setBio(profileData.bio)
      setAvatarUrl(profileData.avatarUrl)
    } catch (error) {
      console.error("Failed to fetch profile data:", error)
    }
  }

  fetchProfileData()
}, [])


  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!initialProfile) {
    alert("초기 데이터를 불러오는 중입니다.")
    return
  }

  const formData = new FormData()

  // 변경된 필드만 FormData에 추가
  if (name !== initialProfile.name) {
    formData.append("name", name || "")
  }

  if (username !== initialProfile.username) {
    formData.append("username", username || "")
  }

  if (bio !== initialProfile.bio) {
    formData.append("bio", bio || "")
  }

  if (processedImage) {
    formData.append("profileImage", processedImage)
  }

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/profile`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    router.back()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        alert(error.response.data.message || "오류가 발생했습니다.")
      }
    }
  }
}



  
  // 페이지 로딩 시 프로필 데이터 가져오기
  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/profile`, {
  //         withCredentials: true, // 인증 정보 포함
  //       })
  //       const { data } = response.data // ApiResponse에서 data 추출
  //       setAvatarUrl(data.profileImageUrl || "/placeholder.svg")
  //       setName(data.name || "")
  //       setUsername(data.username || "")
  //       setBio(data.bio || "")
  //     } catch (error) {
  //       console.error("Failed to fetch profile data:", error)
  //     }
  //   }

  //   fetchProfileData()
  // }, [])

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   const formData = new FormData()
  //   formData.append('username', username)
  //   formData.append('name', name)
  //   formData.append('bio', bio)

  //   if (processedImage) {
  //     formData.append('profileImage', processedImage)
  //   }

  //   try {
  //     const response = await axios.patch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/profile`,
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     )
  //     router.push('/')
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response) {
  //         alert(error.response.data.message || "오류가 발생했습니다.")
  //       }
  //     }
  //   }
  // }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username="username" />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background">
          <h1 className="text-xl font-semibold">프로필 편집</h1>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중
              </>
            ) : (
              "저장"
            )}
          </Button>
        </header>

        <div className="max-w-[640px] mx-auto p-4">
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
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="한글과 영어만 입력 가능"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">사용자 아이디</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="영어, 숫자, 밑줄 및 마침표만 입력 가능"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">한줄소개</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
