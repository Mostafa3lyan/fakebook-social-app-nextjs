import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"

export function useVerifyOtp() {
  const router = useRouter()

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.verifyOtp(data),
    onSuccess: (res) => {
      const resetToken = res?.data?.resetToken
      if (!resetToken) {
        throw new Error("Invalid reset token received from server.")
      }
      toast.success("Code verified! Set your new password.")
      router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`)
    },
  })

  return {
    isPending,
    error,
    verifyOtp: mutate,
    verifyOtpAsync: mutateAsync,
  }
}
