"use client"

import * as React from "react"
import Link from "next/link"
import {
  Globe,
  Users,
  Lock,
  ThumbsUp,
  Share2,
  MapPin,
  Tag,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { IPost, IPublicUser, PostVisibilityEnum, ReactionTypeEnum } from "@/lib/types"
import { useCurrentUser } from "@/hooks/user/use-current-user"
import { useReactPost } from "@/hooks/posts/use-react-post"
import { REACTION_CONFIG, ReactionPicker } from "./reaction-picker"
import { PostAttachments } from "./post-attachments"
import { CommentSection } from "@/components/comments/comment-section"
import { SharePostDialog } from "./share-post-dialog"
import { formatRelativeTime } from "@/lib/utils/date"
import { cn } from "@/lib/utils"

interface PostCommentDialogProps {
  post: IPost
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function PostCommentDialog({
  post,
  open,
  onOpenChange,
}: PostCommentDialogProps) {
  const { user } = useCurrentUser()
  const { mutate: reactPost } = useReactPost()

  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [shareOpen, setShareOpen] = React.useState(false)

  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const currentUserId = user?._id
  const authorName =
    post.createdBy.fullName || `${post.createdBy.firstName} ${post.createdBy.lastName}`
  const authorProfileLink = `/user/${post.createdBy._id}`

  // Reaction detection
  const myReactionEntry = post.reactions?.find((r) => {
    const creatorId = typeof r.createdBy === "string" ? r.createdBy : r.createdBy._id
    return creatorId === currentUserId
  })
  const [localReaction, setLocalReaction] = React.useState<ReactionTypeEnum | null | undefined>(undefined)
  const activeReaction = localReaction !== undefined ? localReaction : (myReactionEntry?.reactionType ?? null)

  const handleMouseEnterLike = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setPickerOpen(true)
    }, 300)
  }

  const handleMouseLeaveLike = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setPickerOpen(false)
    }, 250)
  }

  const handleSelectReaction = (reaction: ReactionTypeEnum) => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)

    const prevReaction = activeReaction
    const isToggleOff = prevReaction === reaction
    setLocalReaction(isToggleOff ? null : reaction)
    setPickerOpen(false)

    reactPost({
      postId: post._id,
      reaction,
      currentReaction: prevReaction,
    })
  }

  const handleDirectLikeClick = () => {
    if (activeReaction) {
      handleSelectReaction(activeReaction)
    } else {
      handleSelectReaction(ReactionTypeEnum.LIKE)
    }
  }

  const topReactions = React.useMemo(() => {
    if (!post.reactionsBreakdown) return []
    return Object.entries(post.reactionsBreakdown)
      .filter(([, count]) => (count as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([type]) => type as ReactionTypeEnum)
  }, [post.reactionsBreakdown])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl w-full p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl rounded-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="p-3.5 border-b border-border/80 flex flex-row items-center justify-center shrink-0">
            <DialogTitle className="text-base sm:text-lg font-bold font-heading text-center">
              {authorName}&apos;s post
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <Link href={authorProfileLink} className="shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-primary">
                <UserAvatar user={post.createdBy} size="md" />
              </Link>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link
                    href={authorProfileLink}
                    className="font-semibold text-sm text-foreground hover:underline"
                  >
                    {authorName}
                  </Link>

                  {post.location?.name && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>is at</span>
                      <span className="font-medium text-foreground/90 inline-flex items-center gap-0.5">
                        <MapPin className="size-3 text-rose-500" />
                        {post.location.name}
                      </span>
                    </span>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>with</span>
                      <span className="font-medium text-foreground/90 inline-flex items-center gap-0.5">
                        <Tag className="size-3 text-primary" />
                        {post.tags.map((t) => t.fullName || t.firstName).join(", ")}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  {post.isEdited && (
                    <>
                      <span>•</span>
                      <span className="text-[11px] italic">Edited</span>
                    </>
                  )}
                  <span>•</span>
                  {post.visibility === PostVisibilityEnum.PUBLIC && (
                    <span title="Public" className="inline-flex items-center">
                      <Globe className="size-3" aria-label="Public" />
                    </span>
                  )}
                  {post.visibility === PostVisibilityEnum.FRIENDS && (
                    <span title="Friends" className="inline-flex items-center">
                      <Users className="size-3" aria-label="Friends" />
                    </span>
                  )}
                  {post.visibility === PostVisibilityEnum.ONLY_ME && (
                    <span title="Only me" className="inline-flex items-center">
                      <Lock className="size-3" aria-label="Only me" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content */}
            {post.content && (
              <div className="text-sm sm:text-[15px] leading-relaxed text-foreground/95 whitespace-pre-wrap wrap-break-word">
                {post.content}
              </div>
            )}

            {/* Post Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <PostAttachments
                attachments={post.attachments}
                postTitle={`Photos from ${authorName}`}
              />
            )}

            {/* Shared Post Embedded Preview */}
            {post.sharedFrom && (
              <div className="rounded-xl border border-border/80 overflow-hidden bg-muted/20">
                {(() => {
                  const originalPost =
                    typeof post.sharedFrom?.originalPostId === "object" && post.sharedFrom.originalPostId
                      ? (post.sharedFrom.originalPostId as IPost)
                      : null

                  const originalAuthor = (
                    typeof post.sharedFrom?.originalAuthorId === "object" && post.sharedFrom.originalAuthorId
                      ? (post.sharedFrom.originalAuthorId as IPublicUser)
                      : originalPost?.createdBy
                  ) ?? null

                  const origName =
                    originalAuthor?.fullName ||
                    (originalAuthor?.firstName && originalAuthor?.lastName
                      ? `${originalAuthor.firstName} ${originalAuthor.lastName}`
                      : originalAuthor?.firstName) ||
                    "User"

                  const origLink = originalAuthor?._id ? `/user/${originalAuthor._id}` : "#"

                  if (!originalPost) {
                    return (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        This shared content isn&apos;t available right now.
                      </div>
                    )
                  }

                  return (
                    <div className="p-3 space-y-2.5">
                      <div className="flex items-center gap-2">
                        {originalAuthor && (
                          <Link href={origLink} className="shrink-0 rounded-full">
                            <UserAvatar user={originalAuthor} size="sm" />
                          </Link>
                        )}
                        <div>
                          <Link href={origLink} className="font-semibold text-xs text-foreground hover:underline">
                            {origName}
                          </Link>
                          {originalPost.createdAt && (
                            <p className="text-[11px] text-muted-foreground">
                              {formatRelativeTime(originalPost.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {originalPost.content && (
                        <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap">{originalPost.content}</p>
                      )}
                      {originalPost.attachments && originalPost.attachments.length > 0 && (
                        <PostAttachments
                          attachments={originalPost.attachments}
                          postTitle={`Attachments shared from ${origName}`}
                        />
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Summary Counters */}
            {(post.reactionsCount > 0 || post.commentsCount > 0 || post.shareCount > 0) && (
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-b border-border/50 pb-2">
                <div className="flex items-center gap-1.5">
                  {topReactions.length > 0 && (
                    <div className="flex -space-x-1 items-center">
                      {topReactions.map((reactionKey) => (
                        <span
                          key={reactionKey}
                          className="inline-flex size-5 items-center justify-center rounded-full bg-background border border-border shadow-2xs text-[11px]"
                        >
                          {REACTION_CONFIG[reactionKey].emoji}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.reactionsCount > 0 && (
                    <span className="font-medium">{post.reactionsCount}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {post.commentsCount > 0 && (
                    <span>
                      {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {post.shareCount > 0 && (
                    <span>
                      {post.shareCount} share{post.shareCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-0.5 pb-1">
              {/* Like Button */}
              <div
                className="relative flex-1"
                onMouseEnter={handleMouseEnterLike}
                onMouseLeave={handleMouseLeaveLike}
              >
                {pickerOpen && (
                  <div className="absolute -top-11 left-0 z-50 pb-2 pointer-events-auto">
                    <ReactionPicker
                      currentReaction={activeReaction}
                      onSelect={handleSelectReaction}
                      onClose={() => setPickerOpen(false)}
                    />
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full min-h-11 cursor-pointer font-semibold transition-colors",
                    activeReaction
                      ? REACTION_CONFIG[activeReaction].activeColor
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={handleDirectLikeClick}
                >
                  {activeReaction ? (
                    <span className="text-lg mr-1.5" aria-hidden="true">
                      {REACTION_CONFIG[activeReaction].emoji}
                    </span>
                  ) : (
                    <ThumbsUp className="size-4 mr-2" aria-hidden="true" />
                  )}
                  <span>{activeReaction ? REACTION_CONFIG[activeReaction].label : "Like"}</span>
                </Button>
              </div>

              {/* Share Button */}
              {post.visibility === PostVisibilityEnum.PUBLIC && (
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full min-h-11 text-muted-foreground hover:text-foreground cursor-pointer font-semibold"
                    onClick={() => setShareOpen(true)}
                  >
                    <Share2 className="size-4 mr-2" aria-hidden="true" />
                    <span>Share</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Full Comments Section with AutoFocus */}
            <CommentSection
              postId={post._id}
              postAuthorId={typeof post.createdBy === "string" ? post.createdBy : post.createdBy?._id}
              commentsCount={post.commentsCount}
              autoFocusComposer={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <SharePostDialog
        post={post}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  )
}
