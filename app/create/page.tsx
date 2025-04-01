"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from 'lucide-react'
import { ImageCarousel } from "@/components/image-carousel"
import axios from "axios"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"

export default function CreatePage() {
  const loggedInUsername = useLoggedInUsername();


  const router = useRouter()
  
  const [content, setContent] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [processedFiles, setProcessedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 500


  const processImage = async (file: File) => {
    try {
      // Dynamically import the libraries only when needed (client-side)
      const [{ default: imageCompression }, { heicTo }] = await Promise.all([
        import('browser-image-compression'),
        import('heic-to')
      ])

      let processedFile = file
      const originalFileName = file.name

      // HEIC conversion
      if (file.name.toLowerCase().endsWith('.heic')) {
        const blob = await heicTo({
          blob: file,
          type: "image/jpeg",
        })
        processedFile = new File([blob], originalFileName.replace('.heic', '.jpg'), {
          type: 'image/jpeg'
        })
      }

      // Compression
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg'
      }

      const compressedBlob = await imageCompression(processedFile, options)

      return new File(
        [compressedBlob],
        processedFile.name,
        { type: 'image/jpeg' }
      )
    } catch (error) {
      console.error('Image processing error:', error)
      throw error
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      try {
        const fileArray = Array.from(files)
        const processedFiles = await Promise.all(fileArray.map(processImage))

        // Create preview URLs
        const newImageUrls = processedFiles.map(file => URL.createObjectURL(file))

        // Update state
        setImageUrls(prev => [...prev, ...newImageUrls])
        setProcessedFiles(prev => [...prev, ...processedFiles])
      } catch (error) {
        alert('이미지 업로드 중 오류가 발생했습니다.')
      }
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
    setProcessedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("content", content);

      // Add processed files
      processedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push("/");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="max-sm:fixed sm:sticky w-full top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">새 게시물</h1>
          <Button disabled={!content.trim() && imageUrls.length === 0} onClick={handleSubmit}>
            게시
          </Button>
        </header>

        <div className="max-w-[640px] mx-auto p-4">
          <div className="p-3">
            <div className="flex items-start space-x-4">
              <div className="flex-1 min-w-0 space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="오늘은 어떤 이야기를 나누고 싶나요? 무엇이든 써보세요!"
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
            <p>당신의 게시물은 누구나 볼 수 있습니다.</p>
            <p className="mt-2">게시물의 내용은 최대 500자까지 작성할 수 있습니다.</p>
          </div>
        </div>
      </main>
    </div>
  )
}