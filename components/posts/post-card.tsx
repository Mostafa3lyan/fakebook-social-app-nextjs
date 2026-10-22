"use client"

import * as React from "react"
import Link from "next/link"
import {
  Globe,
  Users,
  Lock,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Trash2,
  Copy,
  MapPin,
  Tag,
  Check,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserAvatar } from "@/components/shared/user-avatar"
import { IPost, IPublicUser, PostVisibilityEnum, ReactionTypeEnum } from "@/lib/types"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useReactPost } from "@/hooks/use-react-post"
import { useDeletePost } from "@/hooks/use-delete-post"
import { REACTION_CONFIG, ReactionPicker } from "./reaction-picker"
import { PostAttachments } from "./post-attachments"
import { SharePostDialog } from "./share-post-dialog"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: IPost
  onCommentClick?: () => void
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d`

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Recently"
  }
}

export function PostCard({ post, onCommentClick }: PostCardProps) {
  const { user } = useCurrentUser()
  const { mutate: reactPost } = useReactPost()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [shareOpen, setShareOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Identify current user's reaction
  const currentUserId = user?._id
  const isAuthor = currentUserId === post.createdBy._id || currentUserId === (post.createdBy as unknown as string)
  const authorName =
    post.createdBy.fullName || `${post.createdBy.firstName} ${post.createdBy.lastName}`
  const authorProfileLink = `/user/${post.createdBy._id}`

  // Determine current reaction from reactions array if available or local state
  const myReactionEntry = post.reactions?.find((r) => {
    const creatorId = typeof r.createdBy === "string" ? r.createdBy : r.createdBy._id
    return creatorId === currentUserId
  })
  const [localReaction, setLocalReaction] = React.useState<ReactionTypeEnum | null | undefined>(undefined)
  const activeReaction = localReaction !== undefined ? localReaction : (myReactionEntry?.reactionType ?? null)

  // Reaction hover dock management
  const handleMouseEnterLike = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setPickerOpen(true)
    }, 400)
  }

  const handleMouseLeaveLike = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleSelectReaction = (reaction: ReactionTypeEnum) => {
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
      // Toggle off
      handleSelectReaction(activeReaction)
    } else {
      // Default to LIKE
      handleSelectReaction(ReactionTypeEnum.LIKE)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post-${post._id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Post link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeleteConfirm = () => {
    deletePost(
      { postId: post._id, isHardDelete: false },
      {
        onSuccess: () => setDeleteDialogOpen(false),
      }
    )
  }

  // Top reaction emojis summary calculation
  const topReactions = React.useMemo(() => {
    if (!post.reactionsBreakdown) return []
    return Object.entries(post.reactionsBreakdown)
      .filter(([, count]) => (count as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([type]) => type as ReactionTypeEnum)
  }, [post.reactionsBreakdown])

  // Truncation calculation
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
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href={authorProfileLink} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
                <UserAvatar user={post.createdBy} size="md" />
              </Link>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link
                    href={authorProfileLink}
                    className="font-semibold text-sm text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                  >
                    {authorName}
                  </Link>

                  {/* Location Chip */}
                  {post.location?.name && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>is at</span>
                      <span className="font-medium text-foreground/90 inline-flex items-center gap-0.5">
                        <MapPin className="size-3 text-rose-500" />
                        {post.location.name}
                      </span>
                    </span>
                  )}

                  {/* Tagged Friends Chip */}
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>with</span>
                      <span className="font-medium text-foreground/90 inline-flex items-center gap-0.5">
                        <Tag className="size-3 text-primary" />
                        {post.tags.length === 1
                          ? post.tags[0].fullName || `${post.tags[0].firstName} ${post.tags[0].lastName}`
                          : `${post.tags[0].firstName} and ${post.tags.length - 1} other${post.tags.length > 2 ? "s" : ""}`}
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

            {/* Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
                  aria-label="Post actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  {copied ? (
                    <Check className="size-4 mr-2 text-emerald-500" />
                  ) : (
                    <Copy className="size-4 mr-2" />
                  )}
                  <span>{copied ? "Link Copied" : "Copy post link"}</span>
                </DropdownMenuItem>

                {post.visibility === PostVisibilityEnum.PUBLIC && (
                  <DropdownMenuItem onClick={() => setShareOpen(true)} className="cursor-pointer">
                    <Share2 className="size-4 mr-2" />
                    <span>Share to Feed</span>
                  </DropdownMenuItem>
                )}

                {isAuthor && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4 mr-2" />
                      <span>Delete post</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
              postTitle={`Attachments by ${authorName}`}
            />
          )}

          {/* Shared Post Sub-Card */}
          {post.sharedFrom && (
            <div className="overflow-hidden rounded-xl border border-border/80 bg-muted/15 transition-colors">
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
                    <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <Share2 className="size-4 text-muted-foreground/70" />
                      <span>This shared content isn&apos;t available right now.</span>
                    </div>
                  )
                }

                return (
                  <div className="p-3.5 space-y-3">
                    {/* Original Author Header */}
                    <div className="flex items-center gap-2.5">
                      {originalAuthor && (
                        <Link
                          href={origLink}
                          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <UserAvatar user={originalAuthor} size="sm" />
                        </Link>
                      )}
                      <div className="space-y-0.5">
                        <Link
                          href={origLink}
                          className="font-semibold text-xs text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                        >
                          {origName}
                        </Link>
                        {originalPost.createdAt && (
                          <p className="text-[11px] text-muted-foreground">
                            {formatRelativeTime(originalPost.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Original Content */}
                    {originalPost.content && (
                      <div className="text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
                        {originalPost.content}
                      </div>
                    )}

                    {/* Original Attachments */}
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

          {/* Summary / Counters Bar */}
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
                  <span className="font-medium hover:underline cursor-pointer">
                    {post.reactionsCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {post.commentsCount > 0 && (
                  <button
                    type="button"
                    onClick={onCommentClick}
                    className="hover:underline cursor-pointer"
                  >
                    {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
                  </button>
                )}
                {post.shareCount > 0 && (
                  <span>
                    {post.shareCount} share{post.shareCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Interactive Action Bar */}
          <div className="relative flex items-center justify-between pt-1">
            {/* Reaction Picker Floating Dock */}
            {pickerOpen && (
              <div className="absolute -top-12 left-0 z-50">
                <ReactionPicker
                  currentReaction={activeReaction}
                  onSelect={handleSelectReaction}
                  onClose={() => setPickerOpen(false)}
                />
              </div>
            )}

            {/* Like Button */}
            <div
              className="flex-1"
              onMouseEnter={handleMouseEnterLike}
              onMouseLeave={handleMouseLeaveLike}
            >
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

            {/* Comment Button */}
            <div className="flex-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full min-h-11 text-muted-foreground hover:text-foreground cursor-pointer font-semibold"
                onClick={onCommentClick}
              >
                <MessageCircle className="size-4 mr-2" aria-hidden="true" />
                <span>Comment</span>
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
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <SharePostDialog
        post={post}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this post from your feed? It will be soft-deleted and can be restored if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
