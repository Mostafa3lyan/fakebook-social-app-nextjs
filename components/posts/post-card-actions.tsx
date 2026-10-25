"use client"

import * as React from "react"
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IPost, PostVisibilityEnum, ReactionTypeEnum } from "@/lib/types"
import { useCurrentUser } from "@/hooks/user/use-current-user"
import { useReactPost } from "@/hooks/posts/use-react-post"
import { REACTION_CONFIG, ReactionPicker } from "./reaction-picker"
import { cn } from "@/lib/utils"

interface PostCardActionsProps {
  post: IPost
  onCommentClick: () => void
  onShareClick: () => void
}

export function PostCardActions({
  post,
  onCommentClick,
  onShareClick,
}: PostCardActionsProps) {
  const { user } = useCurrentUser()
  const { mutate: reactPost } = useReactPost()

  const [pickerOpen, setPickerOpen] = React.useState(false)
  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const currentUserId = user?._id
  const myReactionEntry = post.reactions?.find((r) => {
    const creatorId = typeof r.createdBy === "string" ? r.createdBy : r.createdBy._id
    return creatorId === currentUserId
  })

  const [localReaction, setLocalReaction] = React.useState<ReactionTypeEnum | null | undefined>(
    undefined
  )
  const activeReaction =
    localReaction !== undefined ? localReaction : (myReactionEntry?.reactionType ?? null)

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

  // Top reaction emojis summary calculation
  const topReactions = React.useMemo(() => {
    if (!post.reactionsBreakdown) return []
    return Object.entries(post.reactionsBreakdown)
      .filter(([, count]) => (count as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([type]) => type as ReactionTypeEnum)
  }, [post.reactionsBreakdown])

  return (
    <div className="space-y-2">
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
      <div className="flex items-center justify-between pt-1">
        {/* Like Button & Reaction Picker Shared Hover Container */}
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
              onClick={onShareClick}
            >
              <Share2 className="size-4 mr-2" aria-hidden="true" />
              <span>Share</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
