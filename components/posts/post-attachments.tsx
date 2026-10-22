"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageOff } from "lucide-react"
import { resolveMediaUrl } from "@/lib/utils/media"

interface PostAttachmentsProps {
  attachments: string[]
  postTitle?: string
}

export function PostAttachments({ attachments = [], postTitle }: PostAttachmentsProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  const [failedImages, setFailedImages] = React.useState<Record<number, boolean>>({})

  const count = attachments.length
  const displayedImages = attachments.slice(0, 4)
  const remainingCount = count - 4

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

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <>
      {/* Gallery Layouts */}
      <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20">
        {count === 1 && (
          <div
            className="relative w-full max-h-130 h-85 sm:h-105 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            {failedImages[0] ? (
              <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground gap-2">
                <ImageOff className="size-8" />
                <span className="text-xs">Image unavailable</span>
              </div>
            ) : (
              <Image
                src={resolveMediaUrl(attachments[0])}
                alt={postTitle || "Post attachment"}
                fill
                unoptimized
                onError={() => handleImageError(0)}
                className="object-cover group-hover:scale-[1.01] transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 680px"
                priority={false}
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="p-2 rounded-full bg-black/60 text-white">
                <ZoomIn className="size-5" />
              </span>
            </div>
          </div>
        )}

        {count === 2 && (
          <div className="grid grid-cols-2 gap-1 h-65 sm:h-80">
            {attachments.slice(0, 2).map((src, idx) => (
              <div
                key={idx}
                className="relative h-full w-full cursor-pointer group overflow-hidden"
                onClick={() => openLightbox(idx)}
              >
                {failedImages[idx] ? (
                  <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground gap-2">
                    <ImageOff className="size-6" />
                    <span className="text-xs">Unavailable</span>
                  </div>
                ) : (
                  <Image
                    src={resolveMediaUrl(src)}
                    alt={`Attachment ${idx + 1}`}
                    fill
                    unoptimized
                    onError={() => handleImageError(idx)}
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, 340px"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {count === 3 && (
          <div className="grid grid-cols-3 gap-1 h-[280px] sm:h-[340px]">
            <div
              className="relative col-span-2 h-full cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(0)}
            >
              {failedImages[0] ? (
                <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground gap-2">
                  <ImageOff className="size-6" />
                  <span className="text-xs">Unavailable</span>
                </div>
              ) : (
                <Image
                  src={resolveMediaUrl(attachments[0])}
                  alt="Attachment 1"
                  fill
                  unoptimized
                  onError={() => handleImageError(0)}
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  sizes="(max-width: 768px) 66vw, 450px"
                />
              )}
            </div>
            <div className="grid grid-rows-2 gap-1 h-full">
              {attachments.slice(1, 3).map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-full w-full cursor-pointer group overflow-hidden"
                  onClick={() => openLightbox(idx + 1)}
                >
                  {failedImages[idx + 1] ? (
                    <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground gap-2">
                      <ImageOff className="size-5" />
                    </div>
                  ) : (
                    <Image
                      src={resolveMediaUrl(src)}
                      alt={`Attachment ${idx + 2}`}
                      fill
                      unoptimized
                      onError={() => handleImageError(idx + 1)}
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      sizes="(max-width: 768px) 33vw, 220px"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {count >= 4 && (
          <div className="grid grid-cols-2 gap-1 h-[300px] sm:h-[360px]">
            {displayedImages.map((src, idx) => {
              const isFourth = idx === 3
              return (
                <div
                  key={idx}
                  className="relative h-full w-full cursor-pointer group overflow-hidden"
                  onClick={() => openLightbox(idx)}
                >
                  {failedImages[idx] ? (
                    <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground gap-2">
                      <ImageOff className="size-6" />
                      <span className="text-xs">Unavailable</span>
                    </div>
                  ) : (
                    <Image
                      src={resolveMediaUrl(src)}
                      alt={`Attachment ${idx + 1}`}
                      fill
                      unoptimized
                      onError={() => handleImageError(idx)}
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      sizes="(max-width: 768px) 50vw, 340px"
                    />
                  )}
                  {isFourth && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl backdrop-blur-xs">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
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

          {/* Image index indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white/90 text-xs font-semibold">
            {lightboxIndex + 1} / {count}
          </div>
        </div>
      )}
    </>
  )
}
