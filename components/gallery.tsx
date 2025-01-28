"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"

interface GalleryProps {
    username?: string | string[];
}

interface GalleryImage {
  postId: number
  imageUrl: string
}

export function Gallery({ username }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/posts/images`)
        setImages(response.data.data)
        setError(null)
        console.log("성공")
      } catch (err) {
        console.error("Error fetching gallery images:", err)
        setError("Failed to load images. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryImages()
  }, [username])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {images.map((image) => (
        <Link href={`/post/${image.postId}`} className="aspect-square relative overflow-hidden">
          <Image src={image.imageUrl || "/placeholder.svg"} alt={`Post ${image.postId}`} fill className="object-cover" />
        </Link>
      ))}
    </div>
  )
}

