"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { commentService } from "@/services/comment.service"
import { IComment, PaginatedResult } from "@/lib/types"

interface UseCommentsOptions {
  postId: string
  enabled?: boolean
  limit?: number
}

export function useComments({
  postId,
  enabled = true,
  limit = 10,
}: UseCommentsOptions) {
  const query = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await commentService.getComments(postId, {
        page: pageParam,
        limit,
      })
      return response.data.comments
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult<IComment>) => {
      return lastPage.hasNextPage && lastPage.page ? lastPage.page + 1 : undefined
    },
    enabled: Boolean(postId) && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  const comments: IComment[] =
    query.data?.pages.flatMap((page) => page.data) ?? []

  const totalCount = query.data?.pages[0]?.total ?? comments.length

  return {
    ...query,
    comments,
    totalCount,
  }
}
