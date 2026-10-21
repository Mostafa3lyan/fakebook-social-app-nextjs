"use client"

import * as React from "react"
import { AlertTriangle, LogOut, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLogout } from "@/hooks/use-logout"
import { useDeleteAccount } from "../_hooks/use-delete-account"
import { ErrorComponent } from "@/components/shared/error-component"

export function DangerZone() {
  const { logout, isLoggingOut } = useLogout()
  const { deleteAccount, isDeleting, error } = useDeleteAccount()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  return (
    <Card className="border-destructive/40 bg-destructive/5 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
          <CardTitle className="text-lg font-bold font-heading">
            Danger Zone
          </CardTitle>
        </div>
        <CardDescription className="text-destructive/80">
          Irreversible and security-critical actions regarding your account sessions and data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sign out from all sessions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background/50">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-foreground">
              Sign out from all devices
            </h3>
            <p className="text-xs text-muted-foreground">
              Revoke all active sessions on your mobile devices, tablets, and other browsers.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => logout("all")}
            disabled={isLoggingOut || isDeleting}
            className="w-full sm:w-auto min-h-11 border-destructive/30 text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="size-4 mr-2" aria-hidden="true" />
            )}
            Sign Out All Devices
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background/50">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-destructive">
              Delete your account
            </h3>
            <p className="text-xs text-muted-foreground">
              Permanently delete your profile, posts, reactions, comments, and media. This action cannot be undone.
            </p>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoggingOut || isDeleting}
                className="w-full sm:w-auto min-h-11 font-semibold cursor-pointer"
              >
                <Trash2 className="size-4 mr-2" aria-hidden="true" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" aria-hidden="true" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action is permanent and cannot be undone. All of your posts, comments, photos, friendships, and identity credentials will be permanently erased.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel className="min-h-11">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteAccount()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-11 font-semibold"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete My Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {error && <ErrorComponent errorMessage={error.message} />}
      </CardContent>
    </Card>
  )
}
