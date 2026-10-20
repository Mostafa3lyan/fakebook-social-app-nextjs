import { Suspense } from "react"
import type { Metadata } from "next"
import { ResetPasswordForm } from "./_components/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Fakebook account password.",
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
