"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { commentService } from "@/services/comment.service"
import { IComment, PaginatedResult, UpdateCommentPayload } from "@/lib/types"

interface UpdateCommentVariables {
  postId: string
  commentId: string
  parentCommentId?: string
  payload: UpdateCommentPayload
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
      payload,
    }: UpdateCommentVariables) => {
      const response = await commentService.updateComment(postId, commentId, payload)
      return response.data.comment
    },
    onSuccess: (updatedComment, { postId, commentId, parentCommentId }) => {
      toast.success("Comment updated.")

      const targetKey = parentCommentId
        ? ["replies", postId, parentCommentId]
        : ["comments", postId]

      queryClient.setQueryData<InfiniteData<PaginatedResult<IComment>>>(
        targetKey,
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((c) =>
                c._id === commentId ? { ...c, ...updatedComment } : c
              ),
            })),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: targetKey })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update comment.")
    },
  })
}
