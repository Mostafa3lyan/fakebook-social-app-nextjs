"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { IPost } from "@/lib/types"
import { useCurrentUser } from "@/hooks/user/use-current-user"
import { PostCardHeader } from "./post-card-header"
import { PostCardActions } from "./post-card-actions"
import { PostAttachments } from "./post-attachments"
import { PostSharedPreview } from "./post-shared-preview"
import { SharePostDialog } from "./share-post-dialog"
import { PostEditDialog } from "./post-edit-dialog"
import { PostCommentDialog } from "./post-comment-dialog"
import { PostDeleteDialog } from "./post-delete-dialog"

interface PostCardProps {
  post: IPost
  onCommentClick?: () => void
}

export function PostCard({ post, onCommentClick }: PostCardProps) {
  const { user } = useCurrentUser()
  const [shareOpen, setShareOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const currentUserId = user?._id
  const isAuthor =
    currentUserId === post.createdBy._id ||
    currentUserId === (post.createdBy as unknown as string)

  const handleCommentAction = () => {
    setCommentDialogOpen(true)
    if (onCommentClick) onCommentClick()
  }

  const shouldTruncate = (post.content?.length ?? 0) > 280
  const displayedContent =
    shouldTruncate && !isExpanded
      ? `${post.content?.slice(0, 280)}...`
      : post.content

  return (
    <>
      <Card id={`post-${post._id}`} className="border-border shadow-xs overflow-visible bg-card">
        <CardContent className="p-4 space-y-3.5">
          {/* Post Header */}
          <PostCardHeader
            post={post}
            isAuthor={isAuthor}
            onEditClick={() => setEditDialogOpen(true)}
            onDeleteClick={() => setDeleteDialogOpen(true)}
            onShareClick={() => setShareOpen(true)}
          />

          {/* Post Content */}
          {post.content && (
            <div className="text-sm sm:text-[15px] leading-relaxed text-foreground/95 whitespace-pre-wrap wrap-break-word">
              {displayedContent}
              {shouldTruncate && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer focus-visible:outline-none"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>
          )}

          {/* Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <PostAttachments
              attachments={post.attachments}
              postTitle={`Attachments by ${post.createdBy.fullName || post.createdBy.firstName}`}
            />
          )}

          {/* Shared Post Sub-Card */}
          <PostSharedPreview sharedFrom={post.sharedFrom} />

          {/* Interactive Action Bar & Reactions Bar */}
          <PostCardActions
            post={post}
            onCommentClick={handleCommentAction}
            onShareClick={() => setShareOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <SharePostDialog
        post={post}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />

      {/* Post Comment Dialog */}
      <PostCommentDialog
        post={post}
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
      />

      {/* Edit Dialog */}
      {isAuthor && (
        <PostEditDialog
          post={post}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <PostDeleteDialog
        postId={post._id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}
