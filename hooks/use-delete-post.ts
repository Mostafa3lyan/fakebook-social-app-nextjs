"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { postService } from "@/services/post.service"
import { IPost, PaginatedResult } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      postId,
      isHardDelete = false,
    }: {
      postId: string
      isHardDelete?: boolean
    }) => {
      if (isHardDelete) {
        await postService.hardDeletePost(postId)
      } else {
        await postService.softDeletePost(postId)
      }
      return postId
    },
    onSuccess: (deletedPostId) => {
      toast.success("Post removed successfully")

      const removePostFromPages = (
        oldData: InfiniteData<PostsQueryData> | undefined
      ) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: {
              ...page.posts,
              total: Math.max(0, page.posts.total - 1),
              data: page.posts.data.filter((post) => post._id !== deletedPostId),
            },
          })),
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        removePostFromPages
      )
      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        removePostFromPages
      )
    },
    onError: () => {
      toast.error("Failed to delete post. Please try again.")
    },
  })
}
