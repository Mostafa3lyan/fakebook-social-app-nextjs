"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { useComments } from "@/hooks/use-comments"
import { CommentComposer } from "./comment-composer"
import { CommentItem } from "./comment-item"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  postId: string
  postAuthorId?: string
  commentsCount?: number
  autoFocusComposer?: boolean
  className?: string
}

export function CommentSection({
  postId,
  postAuthorId,
  autoFocusComposer = false,
  className,
}: CommentSectionProps) {
  const {
    comments,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    totalCount,
  } = useComments({ postId })

  return (
    <div className={cn("pt-3 border-t border-border/60 space-y-4", className)}>
      {/* Top Comment Input Composer */}
      <CommentComposer
        postId={postId}
        autoFocus={autoFocusComposer}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-3 pt-2">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-start gap-2.5">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-14 w-3/4 rounded-2xl" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Previous / More Comments Trigger */}
      {hasNextPage && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1.5 min-h-11"
          >
            {isFetchingNextPage && <Loader2 className="size-3.5 animate-spin" />}
            <span>
              View more comments ({Math.max(0, totalCount - comments.length)} remaining)
            </span>
          </button>
        </div>
      )}

      {/* Comments List */}
      {!isLoading && comments.length > 0 && (
        <div className="space-y-3.5 pt-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <div className="py-2 text-center text-xs text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  )
}
