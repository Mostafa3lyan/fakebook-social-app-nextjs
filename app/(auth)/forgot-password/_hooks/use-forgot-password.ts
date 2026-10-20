import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"
import { ForgotPasswordSchemaType } from "@/lib/schemas/auth.schema"

export function useForgotPassword() {
  const router = useRouter()
  const [isMagicLinkSent, setIsMagicLinkSent] = React.useState(false)

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (values: ForgotPasswordSchemaType) => authService.forgotPassword(values),
    onSuccess: (_, variables) => {
      if (variables.method === "link") {
        setIsMagicLinkSent(true)
        toast.success("Magic reset link dispatched to your email!")
      } else {
        toast.success("Reset code sent! Please check your email.")
        router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`)
      }
    },
  })

  return {
    isPending,
    error,
    isMagicLinkSent,
    forgotPassword: mutate,
    forgotPasswordAsync: mutateAsync,
  }
}
