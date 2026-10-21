"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"

export function useAvatarUpload() {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation<void, Error, File>({
    mutationFn: async (file: File) => {
      // 1. Request S3 presigned PUT URL
      const response = await userService.requestProfileImageUpload({
        contentType: file.type,
        originalname: file.name,
      })
      const url = response.data.url

      // 2. Upload file directly to S3 via presigned URL
      const s3Response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })

      if (!s3Response.ok) {
        throw new Error("Failed to upload image to storage service.")
      }
    },
    onSuccess: () => {
      // Allow S3 lambda a brief moment to update user document
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
      }, 1000)
      toast.success("Profile picture updated successfully!")
    },
  })

  const removeMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      await userService.removeProfileImage()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
      toast.success("Profile picture removed.")
    },
  })

  return {
    uploadAvatar: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,

    removeAvatar: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    removeError: removeMutation.error,
  }
}
