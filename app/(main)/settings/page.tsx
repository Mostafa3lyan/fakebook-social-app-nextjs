"use client"

import * as React from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { AvatarSettings } from "./_components/avatar-settings"
import { ChangePasswordForm } from "./_components/change-password-form"
import { TwoFactorSettings } from "./_components/two-factor-settings"
import { DangerZone } from "./_components/danger-zone"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"

export default function SettingsPage() {
  const { user, isLoading, isError, error } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-2 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorComponent
          errorMessage={error instanceof Error ? error.message : "Failed to load account settings"}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, security credentials, and session preferences.
        </p>
      </div>

      <div className="space-y-6">
        <AvatarSettings user={user} />
        <ChangePasswordForm />
        <TwoFactorSettings user={user} />
        <DangerZone />
      </div>
    </div>
  )
}
