"use client"

import { useUserPosts } from "@/hooks/posts/use-user-posts"
import { PostComposerTrigger, PostFeed } from "@/components/posts"

interface ProfileTimelineProps {
  userId: string
}

export function ProfileTimeline({ userId }: ProfileTimelineProps) {
  const {
    posts,
    isLoading: isPostsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserPosts({ userId })

  return (
    <div className="space-y-4 min-w-0">
      <PostComposerTrigger />

      <div className="flex items-center justify-between pt-1">
        <h2 className="text-lg font-bold font-heading text-foreground">
          My Posts
        </h2>
        <span className="text-xs text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </span>
      </div>

      <PostFeed
        posts={posts}
        isLoading={isPostsLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyTitle="You haven't posted anything yet"
        emptyDescription="Share your thoughts, updates, and photos with your friends."
      />
    </div>
  )
}
