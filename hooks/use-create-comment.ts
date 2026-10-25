"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { commentService } from "@/services/comment.service"
import { CreateCommentPayload, IComment, IPost, PaginatedResult } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

interface CreateCommentVariables {
  postId: string
  payload: CreateCommentPayload
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, payload }: CreateCommentVariables) => {
      const response = await commentService.createComment(postId, payload)
      return { postId, comment: response.data.comment }
    },
    onSuccess: ({ postId, comment }) => {
      // 1. Optimistically prepend new comment into ["comments", postId] cache
      queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
        ["comments", postId],
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          const firstPage = oldData.pages[0]
          const updatedFirstPage = {
            ...firstPage,
            data: [comment, ...firstPage.data],
            total: (firstPage.total ?? 0) + 1,
          }

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          }
        }
      )

      // 2. Increment commentsCount on the post in feed caches
      const incrementCommentCountInPages = (
        oldData: InfiniteData<PostsQueryData> | undefined
      ) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: {
              ...page.posts,
              data: page.posts.data.map((post) =>
                post._id === postId
                  ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
                  : post
              ),
            },
          })),
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        incrementCommentCountInPages
      )

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        incrementCommentCountInPages
      )

      // Invalidate query to ensure fresh backend sync
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post comment. Please try again.")
    },
  })
}
