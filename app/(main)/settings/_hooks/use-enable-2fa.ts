"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { ApiError } from "@/lib/api/errors"

export function useEnable2fa() {
  const queryClient = useQueryClient()

  const requestMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      await authService.request2fa()
    },
    onSuccess: () => {
      toast.success("Verification code sent to your email")
    },
  })

  const enableMutation = useMutation<void, ApiError, string>({
    mutationFn: async (otp: string) => {
      await authService.enable2fa(otp)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
      toast.success("Two-Factor Authentication enabled successfully!")
    },
  })

  const disableMutation = useMutation<void, ApiError, string>({
    mutationFn: async (otp: string) => {
      await authService.disable2fa(otp)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
      toast.success("Two-Factor Authentication disabled.")
    },
  })

  return {
    request2fa: requestMutation.mutate,
    isRequesting: requestMutation.isPending,
    requestError: requestMutation.error,
    isRequested: requestMutation.isSuccess,
    resetRequest: requestMutation.reset,

    enable2fa: enableMutation.mutate,
    isEnabling: enableMutation.isPending,
    enableError: enableMutation.error,
    isSuccess: enableMutation.isSuccess,
    resetEnable: enableMutation.reset,

    disable2fa: disableMutation.mutate,
    isDisabling: disableMutation.isPending,
    disableError: disableMutation.error,
    isDisableSuccess: disableMutation.isSuccess,
    resetDisable: disableMutation.reset,
  }
}
