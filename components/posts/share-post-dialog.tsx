"use client"

import * as React from "react"
import { Globe, Users, Lock, Share2, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IPost, PostVisibilityEnum } from "@/lib/types"
import { useSharePost } from "@/hooks/use-share-post"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useCurrentUser } from "@/hooks/use-current-user"

interface SharePostDialogProps {
  post: IPost
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SharePostDialog({ post, open, onOpenChange }: SharePostDialogProps) {
  const { user } = useCurrentUser()
  const { mutate: sharePost, isPending } = useSharePost()

  const [content, setContent] = React.useState("")
  const [visibility, setVisibility] = React.useState<PostVisibilityEnum>(
    PostVisibilityEnum.PUBLIC
  )

  const handleShare = () => {
    sharePost(
      {
        postId: post._id,
        payload: {
          content: content.trim() || undefined,
          visibility,
        },
      },
      {
        onSuccess: () => {
          setContent("")
          onOpenChange(false)
        },
      }
    )
  }

  const originalAuthorName =
    post.createdBy.fullName || `${post.createdBy.firstName} ${post.createdBy.lastName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5 text-primary" aria-hidden="true" />
            Share Post
          </DialogTitle>
          <DialogDescription>
            Share {originalAuthorName}&apos;s post to your personal feed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User & Audience selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserAvatar user={user} size="sm" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                </p>
              </div>
            </div>

            <Select
              value={visibility}
              onValueChange={(val) => setVisibility(val as PostVisibilityEnum)}
            >
              <SelectTrigger className="w-32.5 h-9 text-xs">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PostVisibilityEnum.PUBLIC}>
                  <div className="flex items-center gap-2 text-xs">
                    <Globe className="size-3.5 text-muted-foreground" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value={PostVisibilityEnum.FRIENDS}>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>Friends</span>
                  </div>
                </SelectItem>
                <SelectItem value={PostVisibilityEnum.ONLY_ME}>
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="size-3.5 text-muted-foreground" />
                    <span>Only Me</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Caption */}
          <Textarea
            placeholder="Say something about this post... (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-22.5 resize-none text-sm"
          />

          {/* Post Preview Snippet */}
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <UserAvatar user={post.createdBy} size="xs" />
              <span>{originalAuthorName}</span>
            </div>
            {post.content && (
              <p className="line-clamp-2 text-foreground/90">{post.content}</p>
            )}
            {post.attachments && post.attachments.length > 0 && (
              <p className="text-[11px] italic">
                [{post.attachments.length} attachment{post.attachments.length > 1 ? "s" : ""}]
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="min-h-11"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleShare}
            disabled={isPending}
            className="min-h-11 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                Sharing...
              </>
            ) : (
              "Share Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
