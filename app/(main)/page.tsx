"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  User,
  Settings,
  Image as ImageIcon,
  Smile,
  ShieldCheck,
} from "lucide-react"

import { useCurrentUser } from "@/hooks/use-current-user"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
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
      {/* Post Composer Quick Trigger (Phase 5/6 Foundation) */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="md" />
            <div className="flex-1">
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 rounded-full bg-muted/60 hover:bg-muted text-sm text-muted-foreground transition-colors cursor-pointer min-h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                onClick={() => {
                  // Phase 6 will open the composer dialog
                }}
                aria-label={`What's on your mind, ${firstName}?`}
              >
                What&apos;s on your mind, {firstName}?
              </button>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="flex items-center justify-around text-xs font-semibold text-muted-foreground pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 min-h-11 cursor-pointer"
            >
              <ImageIcon className="size-4 mr-2 text-emerald-500" aria-hidden="true" />
              Photo / Video
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 min-h-11 cursor-pointer"
            >
              <Smile className="size-4 mr-2 text-amber-500" aria-hidden="true" />
              Feeling / Activity
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
