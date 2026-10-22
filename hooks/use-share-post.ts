"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { postService } from "@/services/post.service"
import { SharePostPayload } from "@/lib/types"

export function useSharePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      postId,
      payload,
    }: {
      postId: string
      payload: SharePostPayload
    }) => {
      const response = await postService.sharePost(postId, payload)
      return response.data.post
    },
    onSuccess: () => {
      toast.success("Post shared successfully to your feed!")
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
    },
    onError: () => {
      toast.error("Failed to share post. It might not be public.")
    },
  })
}
