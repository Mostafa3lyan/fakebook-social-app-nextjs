"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { resolveMediaUrl } from "@/lib/utils/media"
import { cn } from "@/lib/utils"

interface CommentAttachmentsProps {
  attachments: string[]
  className?: string
}

export function CommentAttachments({
  attachments = [],
  className,
}: CommentAttachmentsProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

  const count = attachments.length

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextImage = React.useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % count)
    }
  }, [lightboxIndex, count])

  const prevImage = React.useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) - 1 + count) % count)
    }
  }, [lightboxIndex, count])

  React.useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, nextImage, prevImage])

  if (!attachments || attachments.length === 0) return null

  return (
    <>
      <div className={cn("flex items-center gap-2 pt-1.5 flex-wrap", className)}>
        {attachments.map((key, idx) => {
          const url = resolveMediaUrl(key)
          return (
            <div
              key={key || idx}
              onClick={() => openLightbox(idx)}
              className="relative size-20 sm:size-24 rounded-lg overflow-hidden border border-border/80 bg-background cursor-pointer group shadow-2xs hover:border-primary/60 transition-colors"
            >
              <Image
                src={url}
                alt={`Comment photo ${idx + 1}`}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-1 rounded-full bg-black/60 text-white">
                  <ZoomIn className="size-3.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Comment image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={closeLightbox}
            aria-label="Close image preview"
          >
            <X className="size-6" />
          </button>

          {/* Left Arrow */}
          {count > 1 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Right Arrow */}
          {count > 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {/* Active Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-[90vw] h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={resolveMediaUrl(attachments[lightboxIndex])}
              alt={`Full view ${lightboxIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Image count indicator */}
          {count > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white/90 text-xs font-semibold">
              {lightboxIndex + 1} / {count}
            </div>
          )}
        </div>
      )}
    </>
  )
}
