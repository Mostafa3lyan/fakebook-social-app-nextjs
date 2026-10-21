"use client"

import * as React from "react"
import { Trash2, Loader2, UploadCloud } from "lucide-react"
import { toast } from "sonner"

import { IUser } from "@/lib/types"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAvatarUpload } from "../_hooks/use-avatar-upload"
import { ErrorComponent } from "@/components/shared/error-component"

interface AvatarSettingsProps {
  user: IUser
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function AvatarSettings({ user }: AvatarSettingsProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { uploadAvatar, isUploading, uploadError, removeAvatar, isRemoving, removeError } =
    useAvatarUpload()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Please select a valid image (JPEG, PNG, or WebP).")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image file size must be less than 2 MB.")
      return
    }

    uploadAvatar(file)

    // Reset input value so the same file could be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const error = uploadError || removeError

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading text-foreground">
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload a profile picture to personalize your account across Fakebook. Max file size is 2 MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <UserAvatar
              user={user}
              size="xl"
              className="size-24 sm:size-28 border-2 border-border shadow-md"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs rounded-full flex items-center justify-center">
                <Loader2 className="size-6 text-primary animate-spin" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-label="Upload profile image file"
            />

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isRemoving}
              className="w-full sm:w-auto min-h-11 font-medium cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="size-4 mr-2" aria-hidden="true" />
                  Upload New Photo
                </>
              )}
            </Button>

            {user.profilePicture && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeAvatar()}
                disabled={isUploading || isRemoving}
                className="w-full sm:w-auto min-h-11 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" aria-hidden="true" />
                    Remove
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {error && <ErrorComponent errorMessage={error.message} />}
      </CardContent>
    </Card>
  )
}
