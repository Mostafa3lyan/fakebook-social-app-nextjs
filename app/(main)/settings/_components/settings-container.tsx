"use client"

import { useCurrentUser } from "@/hooks/user/use-current-user"
import { AvatarSettings } from "./avatar-settings"
import { EditProfileForm } from "./edit-profile-form"
import { ChangePasswordForm } from "./change-password-form"
import { TwoFactorSettings } from "./two-factor-settings"
import { BlockedUsersList } from "./blocked-users-list"
import { DangerZone } from "./danger-zone"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"

export function SettingsContainer() {
  const { user, isLoading, isError, error } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
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
    <div className="space-y-6">
      <AvatarSettings user={user} />
      <EditProfileForm user={user} />
      <ChangePasswordForm />
      <TwoFactorSettings user={user} />
      <BlockedUsersList />
      <DangerZone />
    </div>
  )
}
