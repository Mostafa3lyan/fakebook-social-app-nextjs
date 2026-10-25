"use client"

import { usePosts } from "@/hooks/use-posts"
import { PostFeed } from "@/components/posts"

export function HomeFeedStream() {
  const {
    posts,
    isLoading: isPostsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePosts()

  return (
    <div className="pt-2">
      <PostFeed
        posts={posts}
        isLoading={isPostsLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyTitle="Your feed is fresh and quiet"
        emptyDescription="Connect with more friends or be the first to share an update or photo today!"
      />
    </div>
  )
}
