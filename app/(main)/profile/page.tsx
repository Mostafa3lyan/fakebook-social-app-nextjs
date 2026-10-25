"use client"

import * as React from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useUserPosts } from "@/hooks/use-user-posts"
import { ProfileHeader } from "./_components/profile-header"
import { ProfileInfoCard } from "./_components/profile-info-card"
import { PostComposerTrigger, PostFeed } from "@/components/posts"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"

export default function ProfilePage() {
  const { user, isLoading, isError, error } = useCurrentUser()
  const {
    posts,
    isLoading: isPostsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserPosts({ userId: user?._id ?? "" })

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-2">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-4 items-end -mt-12 pl-4">
            <Skeleton className="size-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorComponent
          errorMessage={error instanceof Error ? error.message : "Failed to load profile"}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <ProfileHeader user={user} />
      <ProfileInfoCard user={user} />

      {/* User's Posts Timeline */}
      <div className="space-y-4">
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
    </div>
  )
}
