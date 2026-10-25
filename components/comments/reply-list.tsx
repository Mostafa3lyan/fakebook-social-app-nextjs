"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { useReplies } from "@/hooks/use-replies"
import { Skeleton } from "@/components/ui/skeleton"
import { IComment } from "@/lib/types"

interface ReplyListProps {
  postId: string
  commentId: string
  postAuthorId?: string
  renderReply: (reply: IComment) => React.ReactNode
}

export function ReplyList({
  postId,
  commentId,
  renderReply,
}: ReplyListProps) {
  const {
    replies,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useReplies({ postId, commentId })

  if (isLoading) {
    return (
      <div className="space-y-2 py-1">
        <div className="flex items-start gap-2">
          <Skeleton className="size-6 rounded-full shrink-0" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-44 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 pt-1">
      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1.5 min-h-11"
        >
          {isFetchingNextPage && <Loader2 className="size-3 animate-spin" />}
          <span>View more replies</span>
        </button>
      )}

      {replies.map((reply) => renderReply(reply))}
    </div>
  )
}
