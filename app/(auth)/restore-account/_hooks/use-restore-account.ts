"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"
import { RestoreAccountDto, AuthCredentials } from "@/lib/types"

export function useRestoreAccount() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<AuthCredentials, ApiError, RestoreAccountDto>({
    mutationFn: async (data: RestoreAccountDto) => {
      const response = await userService.restoreAccount(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success("Account restored successfully! Welcome back to Fakebook.")
      router.push("/")
      router.refresh()
    },
  })

  return {
    restoreAccount: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
