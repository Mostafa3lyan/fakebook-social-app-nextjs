"use client"

import Link from "next/link"
import {
  Sparkles,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react"

import { useCurrentUser } from "@/hooks/use-current-user"
import { usePosts } from "@/hooks/use-posts"
import { PostComposerTrigger, PostFeed } from "@/components/posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const {
    posts,
    isLoading: isPostsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePosts()

  if (isUserLoading) {
    return (
      <div className="max-w-2xl mx-auto py-2 space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  const firstName = user?.firstName || "Friend"

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-5">
      {/* Post Composer Quick Trigger */}
      <PostComposerTrigger />

      {/* Welcome & Quick Navigation Card */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="h-2 bg-linear-to-r from-primary via-blue-500 to-indigo-500" />
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <CardTitle className="text-xl font-bold font-heading text-foreground">
              Welcome back, {firstName}!
            </CardTitle>
          </div>
          <CardDescription>
            Your Fakebook session is active. You can customize your profile, secure your account with 2FA, or explore your settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild variant="outline" className="justify-start min-h-11">
              <Link href="/profile">
                <User className="size-4 mr-2 text-primary" aria-hidden="true" />
                <span>View Full Profile</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start min-h-11">
              <Link href="/settings">
                <Settings className="size-4 mr-2 text-primary" aria-hidden="true" />
                <span>Account & Security Settings</span>
              </Link>
            </Button>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>
                {user?.twoFactorVerified
                  ? "Two-Factor Authentication is currently active."
                  : "Boost your account security by enabling Two-Factor Authentication in Settings."}
              </span>
            </div>
            {!user?.twoFactorVerified && (
              <Button asChild size="sm" variant="ghost" className="shrink-0 text-primary hover:text-primary/90 text-xs font-semibold h-8 px-2">
                <Link href="/settings">Enable 2FA</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Social Feed */}
      <div className="pt-2">
        <h2 className="sr-only">News Feed</h2>
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
    </div>
  )
}
