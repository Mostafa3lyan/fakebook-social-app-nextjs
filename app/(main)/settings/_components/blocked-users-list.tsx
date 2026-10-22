"use client"

import * as React from "react"
import { ShieldAlert, UserCheck, Loader2 } from "lucide-react"

import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorComponent } from "@/components/shared/error-component"
import { useBlockedUsers } from "../_hooks/use-blocked-users"

export function BlockedUsersList() {
  const { blockedUsers, isLoading, isError, error, unblockUser, isUnblocking } =
    useBlockedUsers(1, 20)

  const usersList = blockedUsers?.data || []

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-amber-500" aria-hidden="true" />
          <CardTitle className="text-lg font-bold font-heading text-foreground">
            Blocked Accounts
          </CardTitle>
        </div>
        <CardDescription>
          Once you block someone, they will not be able to find your profile, view your posts, or send you friend requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        )}

        {isError && (
          <ErrorComponent
            errorMessage={error instanceof Error ? error.message : "Failed to load blocked users"}
          />
        )}

        {!isLoading && !isError && usersList.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            You haven&apos;t blocked anyone.
          </div>
        )}

        {!isLoading && !isError && usersList.length > 0 && (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {usersList.map((blocked) => (
              <div
                key={blocked._id}
                className="flex items-center justify-between p-3.5 bg-card hover:bg-muted/30 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    src={blocked.profilePicture}
                    name={`${blocked.firstName} ${blocked.lastName}`}
                    size="sm"
                  />
                  <span className="font-semibold text-sm text-foreground truncate">
                    {blocked.firstName} {blocked.lastName}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => unblockUser(blocked._id)}
                  disabled={isUnblocking}
                  className="min-h-11 shrink-0 font-medium cursor-pointer"
                  aria-label={`Unblock ${blocked.firstName} ${blocked.lastName}`}
                >
                  {isUnblocking ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <UserCheck className="size-4 mr-1.5" aria-hidden="true" />
                      Unblock
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
