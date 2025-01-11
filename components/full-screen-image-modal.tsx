import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { X } from 'lucide-react'

interface FullScreenImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
}

export function FullScreenImageModal({ isOpen, onClose, imageSrc }: FullScreenImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] max-h-[90vh] p-0 bg-background border-none shadow-lg overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center bg-black/5 backdrop-blur-sm">
          <Image
            src={imageSrc}
            alt="Full screen image"
            width={1200}
            height={1200}
            className="max-w-full max-h-[calc(90vh-2rem)] object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-background rounded-full text-foreground transition-colors"
          >
        
            <span className="sr-only">Close</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

