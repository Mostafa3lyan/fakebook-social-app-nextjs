"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { commentService } from "@/services/comment.service"
import { IComment, IPost, PaginatedResult } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

interface DeleteCommentVariables {
  postId: string
  commentId: string
  parentCommentId?: string
  repliesCount?: number
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, commentId }: DeleteCommentVariables) => {
      const response = await commentService.deleteComment(postId, commentId)
      return response.data.comment
    },
    onSuccess: (_data, { postId, commentId, parentCommentId, repliesCount = 0 }) => {
      toast.success("Comment deleted.")

      if (parentCommentId) {
        // 1. Remove reply from ["replies", postId, parentCommentId]
        queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
          ["replies", postId, parentCommentId],
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.filter((c) => c._id !== commentId),
                total: Math.max(0, (page.total ?? 1) - 1),
              })),
            }
          }
        )

        // 2. Decrement repliesCount on parent comment in ["comments", postId]
        queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
          ["comments", postId],
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((c) =>
                  c._id === parentCommentId
                    ? { ...c, repliesCount: Math.max(0, (c.repliesCount ?? 1) - 1) }
                    : c
                ),
              })),
            }
          }
        )

        // 3. Decrement commentsCount on post by 1
        const decrementCountInPages = (
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
                    ? { ...post, commentsCount: Math.max(0, (post.commentsCount ?? 1) - 1) }
                    : post
                ),
              },
            })),
          }
        }
        queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
          { queryKey: ["posts"] },
          decrementCountInPages
        )
        queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
          { queryKey: ["user-posts"] },
          decrementCountInPages
        )
      } else {
        // Top-level comment removed
        queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
          ["comments", postId],
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.filter((c) => c._id !== commentId),
                total: Math.max(0, (page.total ?? 1) - 1),
              })),
            }
          }
        )

        // Decrement post commentsCount by 1 + replies
        const totalRemoved = 1 + repliesCount
        const decrementCountInPages = (
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
                    ? {
                        ...post,
                        commentsCount: Math.max(
                          0,
                          (post.commentsCount ?? totalRemoved) - totalRemoved
                        ),
                      }
                    : post
                ),
              },
            })),
          }
        }
        queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
          { queryKey: ["posts"] },
          decrementCountInPages
        )
        queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
          { queryKey: ["user-posts"] },
          decrementCountInPages
        )
      }

      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      if (parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", postId, parentCommentId],
        })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete comment.")
    },
  })
}
