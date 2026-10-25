"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { postService } from "@/services/post.service"
import { IPost, PaginatedResult, UpdatePostPayload } from "@/lib/types"

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

interface UpdatePostVariables {
  postId: string
  payload: UpdatePostPayload
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, payload }: UpdatePostVariables) => {
      const response = await postService.updatePost(postId, payload)
      return response.data.post
    },
    onSuccess: (updatedPost) => {
      toast.success("Post updated successfully!")

      const patchPostInPages = (
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
                post._id === updatedPost._id ? { ...post, ...updatedPost } : post
              ),
            },
          })),
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        patchPostInPages
      )

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        patchPostInPages
      )

      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update post. Please try again.")
    },
  })
}
