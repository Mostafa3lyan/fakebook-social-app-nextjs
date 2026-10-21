"use client"

import * as React from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { ProfileHeader } from "./_components/profile-header"
import { ProfileInfoCard } from "./_components/profile-info-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareText } from "lucide-react"

export default function ProfilePage() {
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
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <ProfileHeader user={user} />
      <ProfileInfoCard user={user} />

      {/* Posts Section Placeholder (Phase 5 integration point) */}
      <Card className="border-border shadow-2xs">
        <CardContent className="p-8 text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquareText className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold font-heading text-foreground">
            No Posts Yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your posts and social shares will appear here once you create them on your news feed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
