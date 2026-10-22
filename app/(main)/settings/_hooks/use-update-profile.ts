"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"
import { UpdateProfileDto, IUser } from "@/lib/types"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation<IUser, ApiError, UpdateProfileDto>({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await userService.updateProfile(data)
      return response.data.profile
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["current-user"], updatedProfile)
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
      toast.success("Profile updated successfully!")
    },
  })

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
