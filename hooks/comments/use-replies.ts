"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { commentService } from "@/services/comment.service"
import { IComment, PaginatedResult } from "@/lib/types"

interface UseRepliesOptions {
  postId: string
  commentId: string
  enabled?: boolean
  limit?: number
}

export function useReplies({
  postId,
  commentId,
  enabled = true,
  limit = 10,
}: UseRepliesOptions) {
  const query = useInfiniteQuery({
    queryKey: ["replies", postId, commentId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await commentService.getReplies(postId, commentId, {
        page: pageParam,
        limit,
      })
      return response.data.replies
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult<IComment>) => {
      return lastPage.hasNextPage && lastPage.page ? lastPage.page + 1 : undefined
    },
    enabled: Boolean(postId) && Boolean(commentId) && enabled,
    staleTime: 1000 * 60 * 2,
  })

  const replies: IComment[] =
    query.data?.pages.flatMap((page) => page.data) ?? []

  const totalCount = query.data?.pages[0]?.total ?? replies.length

  return {
    ...query,
    replies,
    totalCount,
  }
}
