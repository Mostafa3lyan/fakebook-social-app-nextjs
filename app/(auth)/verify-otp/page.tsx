import { Suspense } from "react"
import type { Metadata } from "next"
import { VerifyOtpForm } from "./_components/verify-otp-form"

export const metadata: Metadata = {
  title: "Verify Security Code",
  description: "Verify your security code to reset your Fakebook password.",
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  )
}
