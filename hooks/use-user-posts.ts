"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { postService } from "@/services/post.service"
import { IPost, PaginatedResult } from "@/lib/types"

interface UseUserPostsOptions {
  userId: string
  search?: string
  limit?: number
}

export function useUserPosts({ userId, search, limit = 10 }: UseUserPostsOptions) {
  const query = useInfiniteQuery<{ posts: PaginatedResult<IPost> }>({
    queryKey: ["user-posts", userId, { search }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await postService.getUserPosts(userId, {
        page: pageParam as number,
        limit,
        search,
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { hasNextPage, page } = lastPage.posts
      return hasNextPage && page ? page + 1 : undefined
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
  })

  const posts = query.data?.pages.flatMap((page) => page.posts.data) ?? []

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  }
}
