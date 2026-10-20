import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"

export function useConfirmEmail() {
  const router = useRouter()

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.confirmEmail(data),
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.")
      router.push("/login")
    },
  })

  return {
    isPending,
    error,
    confirmEmail: mutate,
    confirmEmailAsync: mutateAsync,
  }
}
