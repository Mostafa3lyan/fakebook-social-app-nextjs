import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { authService } from "@/services"
import { getErrorMessage } from "@/lib/api/errors"

interface UseResendConfirmationOptions {
  onCooldown?: (seconds: number) => void
}

export function useResendConfirmation(options?: UseResendConfirmationOptions) {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (email: string) => authService.resendConfirmEmail(email),
    onSuccess: () => {
      toast.success("A new verification code has been sent to your email.")
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
    resendConfirmation: mutate,
    resendConfirmationAsync: mutateAsync,
  }
}
