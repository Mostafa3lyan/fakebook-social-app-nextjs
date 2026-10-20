import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"
import { safeRedirectTarget } from "@/lib/utils/safe-redirect"

interface UseVerify2faOptions {
  onSuccess?: () => void
}

export function useVerify2fa(options?: UseVerify2faOptions) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.loginConfirm(data),
    onSuccess: () => {
      options?.onSuccess?.()
      toast.success("Identity verified! Logging in...")
      const destination = safeRedirectTarget(callbackUrl, "/")
      router.push(destination)
      router.refresh()
    },
  })

  return {
    isPending,
    error,
    verify2fa: mutate,
    verify2faAsync: mutateAsync,
  }
}
