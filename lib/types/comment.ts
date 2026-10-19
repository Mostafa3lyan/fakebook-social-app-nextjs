import { ReactionTypeEnum } from "./enums"
import { IReaction } from "./post"
import { IPublicUser } from "./user"

export interface IComment {
  _id: string
  postId: string
  commentId?: string // Present when this is a reply to another comment
  content?: string
  attachments?: string[]
  createdBy: IPublicUser
  updatedBy?: IPublicUser
  tags?: IPublicUser[]
  reactions?: IReaction[]
  reactionsCount: number
  reactionsBreakdown: Record<ReactionTypeEnum, number>
  repliesCount: number
  isEdited: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCommentPayload {
  content?: string
  tags?: string[]
  files?: File[]
}

export interface UpdateCommentPayload {
  content?: string
  tags?: string[]
  removeAttachments?: string[]
  files?: File[]
}
