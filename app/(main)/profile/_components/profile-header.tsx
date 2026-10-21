"use client"

import * as React from "react"
import Link from "next/link"
import { Settings, Share2, ShieldCheck, Check, Calendar, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { IUser } from "@/lib/types"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  user: IUser
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [copied, setCopied] = React.useState(false)

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/user/${user._id}`
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success("Profile link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const formattedJoinDate = React.useMemo(() => {
    if (!user.createdAt) return "Recently"
    return new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    })
  }, [user.createdAt])

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
      {/* Decorative gradient banner */}
      <div className="h-32 sm:h-44 bg-linear-to-r from-primary/80 via-primary to-blue-600 relative">
        <div className="absolute inset-0 bg-pattern opacity-10" />
      </div>

      {/* Profile info section */}
      <div className="px-4 sm:px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
          {/* Avatar & Names */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <UserAvatar
                user={user}
                size="xl"
                className="size-28 sm:size-36 border-4 border-card ring-2 ring-primary/20 shadow-md"
              />
            </div>

            <div className="space-y-1 mb-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </h1>
                {user.role === "admin" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Admin
                  </span>
                )}
                {user.twoFactorVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    2FA Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground pt-0.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1 sm:flex-initial min-h-11 cursor-pointer font-medium"
              aria-label="Share profile link"
            >
              {copied ? (
                <>
                  <Check className="size-4 mr-2 text-emerald-500" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Share2 className="size-4 mr-2" aria-hidden="true" />
                  Share Profile
                </>
              )}
            </Button>

            <Button
              asChild
              size="sm"
              className="flex-1 sm:flex-initial min-h-11 font-medium cursor-pointer"
            >
              <Link href="/settings">
                <Settings className="size-4 mr-2" aria-hidden="true" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
