import { api } from "@/lib/api/client"
import {
  CreateCommentPayload,
  IComment,
  PaginatedResult,
  ReactionTypeEnum,
  UpdateCommentPayload,
} from "@/lib/types"

export const commentService = {
  getComments: (postId: string, params: { page?: number; limit?: number } = {}) =>
    api<{ comments: PaginatedResult<IComment> }>(`/post/${postId}/comment`, {
      method: "GET",
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    }),

  getCommentById: (postId: string, commentId: string) =>
    api<{ comment: IComment }>(`/post/${postId}/comment/${commentId}`, {
      method: "GET",
    }),

  createComment: (postId: string, payload: CreateCommentPayload) => {
    const formData = new FormData()
    if (payload.content) formData.append("content", payload.content)

    if (payload.tags && payload.tags.length > 0) {
      formData.append("tags", JSON.stringify(payload.tags))
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.slice(0, 2).forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api<{ comment: IComment }>(`/post/${postId}/comment`, {
      method: "POST",
      body: formData,
    })
  },

  updateComment: (
    postId: string,
    commentId: string,
    payload: UpdateCommentPayload
  ) => {
    const formData = new FormData()
    if (payload.content !== undefined) formData.append("content", payload.content)

    if (payload.tags !== undefined) {
      formData.append("tags", JSON.stringify(payload.tags))
    }

    if (payload.removeAttachments && payload.removeAttachments.length > 0) {
      formData.append("removeAttachments", JSON.stringify(payload.removeAttachments))
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.slice(0, 2).forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api<{ comment: IComment }>(`/post/${postId}/comment/${commentId}`, {
      method: "PATCH",
      body: formData,
    })
  },

  getReplies: (
    postId: string,
    commentId: string,
    params: { page?: number; limit?: number } = {}
  ) =>
    api<{ replies: PaginatedResult<IComment> }>(
      `/post/${postId}/comment/${commentId}/reply`,
      {
        method: "GET",
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      }
    ),

  replyOnComment: (
    postId: string,
    commentId: string,
    payload: CreateCommentPayload
  ) => {
    const formData = new FormData()
    if (payload.content) formData.append("content", payload.content)

    if (payload.tags && payload.tags.length > 0) {
      formData.append("tags", JSON.stringify(payload.tags))
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.slice(0, 2).forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api<{ comment: IComment }>(
      `/post/${postId}/comment/${commentId}/reply`,
      {
        method: "POST",
        body: formData,
      }
    )
  },

  reactAtComment: (postId: string, commentId: string, reaction: ReactionTypeEnum) =>
    api<{ comment: Pick<IComment, "_id" | "reactionsCount" | "reactionsBreakdown"> }>(
      `/post/${postId}/comment/${commentId}/react`,
      {
        method: "POST",
        body: JSON.stringify({ reaction }),
      }
    ),

  deleteComment: (postId: string, commentId: string) =>
    api<{ comment: Partial<IComment> }>(`/post/${postId}/comment/${commentId}`, {
      method: "DELETE",
    }),
}
