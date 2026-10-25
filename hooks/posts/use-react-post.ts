"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { toast } from "sonner"
import { postService } from "@/services/post.service"
import { IPost, PaginatedResult, ReactionTypeEnum } from "@/lib/types"

interface ReactPostParams {
  postId: string
  reaction: ReactionTypeEnum
  currentReaction?: ReactionTypeEnum | null
}

interface PostsQueryData {
  posts: PaginatedResult<IPost>
}

export function useReactPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, reaction }: ReactPostParams) => {
      const response = await postService.reactAtPost(postId, reaction)
      return { postId, postData: response.data.post }
    },
    onMutate: async ({ postId, reaction, currentReaction }) => {
      // Cancel outgoing queries for posts
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      await queryClient.cancelQueries({ queryKey: ["user-posts"] })

      const updatePostInPages = (oldData: InfiniteData<PostsQueryData> | undefined) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: {
              ...page.posts,
              data: page.posts.data.map((post) => {
                if (post._id !== postId) return post

                const isToggleOff = currentReaction === reaction
                const isSwap = Boolean(currentReaction && currentReaction !== reaction)

                const newCount = isToggleOff
                  ? Math.max(0, post.reactionsCount - 1)
                  : isSwap
                  ? post.reactionsCount
                  : post.reactionsCount + 1

                const breakdown = { ...(post.reactionsBreakdown || {}) }
                if (currentReaction && breakdown[currentReaction]) {
                  breakdown[currentReaction] = Math.max(0, breakdown[currentReaction] - 1)
                }
                if (!isToggleOff) {
                  breakdown[reaction] = (breakdown[reaction] || 0) + 1
                }

                return {
                  ...post,
                  reactionsCount: newCount,
                  reactionsBreakdown: breakdown,
                }
              }),
            },
          })),
        }
      }

      // Optimistically update
      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        updatePostInPages
      )
      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        updatePostInPages
      )
    },
    onSuccess: ({ postId, postData }) => {
      const patchWithServerData = (oldData: InfiniteData<PostsQueryData> | undefined) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: {
              ...page.posts,
              data: page.posts.data.map((post) => {
                if (post._id !== postId) return post
                return {
                  ...post,
                  reactionsCount: postData.reactionsCount,
                  reactionsBreakdown: postData.reactionsBreakdown,
                }
              }),
            },
          })),
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["posts"] },
        patchWithServerData
      )
      queryClient.setQueriesData<InfiniteData<PostsQueryData>>(
        { queryKey: ["user-posts"] },
        patchWithServerData
      )
    },
    onError: () => {
      toast.error("Failed to update reaction")
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
    },
  })
}
