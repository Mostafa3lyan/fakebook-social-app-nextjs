import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { authService } from "@/services"
import { getErrorMessage } from "@/lib/api/errors"

interface UseResendOtpOptions {
  onCooldown?: (seconds: number) => void
}

export function useResendOtp(options?: UseResendOtpOptions) {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (email: string) => authService.forgotPassword({ email, method: "otp" }),
    onSuccess: () => {
      toast.success("A new 6-digit recovery code has been sent.")
      options?.onCooldown?.(60)
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err)
      const match = message.match(/(\d+)\s*seconds/i)
      if (match?.[1]) {
        const seconds = parseInt(match[1], 10)
        options?.onCooldown?.(seconds)
      } else {
        options?.onCooldown?.(60)
      }
    },
  })

  return {
    isPending,
    error,
    resendOtp: mutate,
    resendOtpAsync: mutateAsync,
  }
}
