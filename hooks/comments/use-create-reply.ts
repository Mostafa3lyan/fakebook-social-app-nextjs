"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { commentService } from "@/services/comment.service"
import { CreateCommentPayload, IComment, IPost, PaginatedResult } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

interface CreateReplyVariables {
  postId: string
  commentId: string
  payload: CreateCommentPayload
}

export function useCreateReply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, commentId, payload }: CreateReplyVariables) => {
      const response = await commentService.replyOnComment(postId, commentId, payload)
      return { postId, commentId, reply: response.data.comment }
    },
    onSuccess: ({ postId, commentId, reply }) => {
      // 1. Optimistically append reply to ["replies", postId, commentId] cache
      queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
        ["replies", postId, commentId],
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          const lastPageIndex = oldData.pages.length - 1
          const lastPage = oldData.pages[lastPageIndex]

          const updatedLastPage = {
            ...lastPage,
            data: [...lastPage.data, reply],
            total: (lastPage.total ?? 0) + 1,
          }

          return {
            ...oldData,
            pages: [
              ...oldData.pages.slice(0, lastPageIndex),
              updatedLastPage,
            ],
          }
        }
      )

      // 2. Increment repliesCount on the parent comment in ["comments", postId]
      queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
        ["comments", postId],
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((c) =>
                c._id === commentId
                  ? { ...c, repliesCount: (c.repliesCount ?? 0) + 1 }
                  : c
              ),
            })),
          }
        }
      )

      // 3. Increment commentsCount on the post in feeds
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

      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post reply. Please try again.")
    },
  })
}
