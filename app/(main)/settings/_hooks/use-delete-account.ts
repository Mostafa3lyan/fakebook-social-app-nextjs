"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"

export function useDeleteAccount() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      await userService.deleteAccount()
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success("Your account has been deleted.")
      router.push("/signup")
      router.refresh()
    },
  })

  return {
    deleteAccount: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}
