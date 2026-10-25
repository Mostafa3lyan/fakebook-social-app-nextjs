import { api } from "@/lib/api/client"
import {
  CreatePostPayload,
  IPost,
  PaginatedResult,
  ReactionTypeEnum,
  SharePostPayload,
  UpdatePostPayload,
} from "@/lib/types"

export const postService = {
  getPosts: (params: { page?: number; limit?: number; search?: string } = {}) =>
    api<{ posts: PaginatedResult<IPost> }>("/post", {
      method: "GET",
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
      },
    }),

  getPostById: (postId: string) =>
    api<{ post: IPost }>(`/post/${postId}`, {
      method: "GET",
    }),

  getUserPosts: (
    userId: string,
    params: { page?: number; limit?: number; search?: string } = {}
  ) =>
    api<{ posts: PaginatedResult<IPost> }>(`/post/user/${userId}`, {
      method: "GET",
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
      },
    }),

  createPost: (payload: CreatePostPayload) => {
    const formData = new FormData()
    if (payload.content) formData.append("content", payload.content)
    formData.append("visibility", payload.visibility)

    if (payload.tags && payload.tags.length > 0) {
      formData.append("tags", JSON.stringify(payload.tags))
    }

    if (payload.location) {
      formData.append("location", JSON.stringify(payload.location))
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api<{ post: IPost }>("/post", {
      method: "POST",
      body: formData,
    })
  },

  updatePost: (postId: string, payload: UpdatePostPayload) => {
    const formData = new FormData()
    if (payload.content !== undefined) formData.append("content", payload.content)
    if (payload.visibility) formData.append("visibility", payload.visibility)

    if (payload.tags !== undefined) {
      formData.append("tags", JSON.stringify(payload.tags))
    }

    if (payload.location !== undefined) {
      formData.append("location", JSON.stringify(payload.location))
    }

    if (payload.removeAttachments && payload.removeAttachments.length > 0) {
      formData.append("removeAttachments", JSON.stringify(payload.removeAttachments))
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api<{ post: IPost }>(`/post/${postId}`, {
      method: "PATCH",
      body: formData,
    })
  },

  sharePost: (postId: string, payload: SharePostPayload) =>
    api<{ post: IPost }>(`/post/${postId}/share`, {
      method: "POST",
      body: JSON.stringify({
        content: payload.content || undefined,
        visibility: payload.visibility,
        tags: payload.tags?.length ? payload.tags : undefined,
      }),
    }),

  reactAtPost: (postId: string, reaction: ReactionTypeEnum) =>
    api<{ post: Pick<IPost, "_id" | "reactionsCount" | "reactionsBreakdown"> }>(
      `/post/${postId}/react`,
      {
        method: "POST",
        body: JSON.stringify({ reaction }),
      }
    ),

  softDeletePost: (postId: string) =>
    api<{ post: Partial<IPost> }>(`/post/${postId}/soft-delete`, {
      method: "DELETE",
    }),

  restorePost: (postId: string) =>
    api<{ post: Partial<IPost> }>(`/post/${postId}/restore`, {
      method: "PATCH",
    }),

  hardDeletePost: (postId: string) =>
    api<{ post: Partial<IPost> }>(`/post/${postId}`, {
      method: "DELETE",
    }),
}
