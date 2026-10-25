"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { ApiError } from "@/lib/api/errors"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<void, ApiError, "current" | "all" | undefined>({
    mutationFn: async (flag = "current") => {
      await authService.logout(flag)
    },
    onSuccess: (_, flag) => {
      queryClient.clear()
      toast.success(
        flag === "all" ? "Signed out from all devices" : "Signed out successfully"
      )
      router.push("/login")
      router.refresh()
    },
    onError: (err) => {
      // Even if backend fails (e.g. token expired), still redirect to login
      queryClient.clear()
      toast.error(err.message || "Signed out")
      router.push("/login")
      router.refresh()
    },
  })

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  }
}
