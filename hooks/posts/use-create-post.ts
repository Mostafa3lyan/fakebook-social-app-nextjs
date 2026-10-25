"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { postService } from "@/services/post.service"
import { CreatePostPayload, IPost, PaginatedResult } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const response = await postService.createPost(payload)
      return response.data.post
    },
    onSuccess: (newPost) => {
      toast.success("Post published to your feed!")

      // Helper to prepend new post to page 1 of active infinite queries
      const prependPostToPages = (
        oldData: InfiniteData<PostsQueryData> | undefined
      ) => {
        if (!oldData || !oldData.pages.length) return oldData

        const firstPage = oldData.pages[0]
        const updatedFirstPage = {
          ...firstPage,
          posts: {
            ...firstPage.posts,
            total: (firstPage.posts.total || 0) + 1,
            data: [newPost, ...firstPage.posts.data],
          },
        }

        return {
          ...oldData,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        prependPostToPages
      )

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        prependPostToPages
      )

      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create post. Please try again.")
    },
  })
}
