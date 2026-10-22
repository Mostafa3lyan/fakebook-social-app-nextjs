"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"

export function useDeactivateAccount() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      await userService.softDeleteAccount()
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success(
        "Account deactivated. You can restore your account within 30 days by signing in."
      )
      router.push("/login")
      router.refresh()
    },
  })

  return {
    deactivateAccount: mutation.mutate,
    isDeactivating: mutation.isPending,
    error: mutation.error,
  }
}
