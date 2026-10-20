import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"
import { ResetPasswordSchemaType } from "@/lib/schemas/auth.schema"

export function useResetPassword() {
  const router = useRouter()

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (values: ResetPasswordSchemaType) => authService.resetPassword(values),
    onSuccess: () => {
      toast.success("Password reset successfully! Please sign in with your new password.")
      router.push("/login")
    },
  })

  return {
    isPending,
    error,
    resetPassword: mutate,
    resetPasswordAsync: mutateAsync,
  }
}
