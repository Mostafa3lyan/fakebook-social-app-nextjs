"use client"

import { useCurrentUser } from "@/hooks/user/use-current-user"
import { ProfileHeader } from "./profile-header"
import { ProfileInfoCard } from "./profile-info-card"
import { ProfileTimeline } from "./profile-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"

export function ProfileView() {
  const { user, isLoading, isError, error } = useCurrentUser()

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
    <div className="max-w-5xl mx-auto py-2 space-y-5">
      <ProfileHeader user={user} />

      {/* Facebook-style 2-column profile layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: About & Info */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-18">
          <ProfileInfoCard user={user} />
        </div>

        {/* Right Column: Timeline Stream */}
        <div className="lg:col-span-7">
          <ProfileTimeline userId={user._id} />
        </div>
      </div>
    </div>
  )
}
