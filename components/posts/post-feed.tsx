"use client"

import * as React from "react"
import { Loader2, CheckCircle2 } from "lucide-react"

import { IPost } from "@/lib/types"
import { PostCard } from "./post-card"
import { PostSkeleton } from "./post-skeleton"
import { EmptyFeed } from "./empty-feed"

interface PostFeedProps {
  posts: IPost[]
  isLoading: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
  emptyTitle?: string
  emptyDescription?: string
}

export function PostFeed({
  posts,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  emptyTitle,
  emptyDescription,
}: PostFeedProps) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  // Automatic infinite scroll observer
  React.useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage()
        }
      },
      {
        rootMargin: "350px", // Pre-fetch before user reaches the very bottom
        threshold: 0.1,
      }
    )

    const target = sentinelRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyFeed
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* Invisible sentinel observed for automatic scroll trigger */}
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="h-10 w-full flex items-center justify-center"
          aria-hidden="true"
        />
      )}

      {/* Loading state indicator during automatic page fetching */}
      {isFetchingNextPage && (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground animate-in fade-in duration-200">
          <Loader2 className="size-6 animate-spin text-primary" aria-label="Loading more posts" />
          <span className="text-xs font-medium">Loading more posts...</span>
        </div>
      )}

      {/* Caught-up indicator when all posts have been loaded */}
      {!hasNextPage && posts.length > 3 && (
        <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-border/60" />
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            You&apos;re all caught up
          </span>
          <span className="h-px w-12 bg-border/60" />
        </div>
      )}
    </div>
  )
}
