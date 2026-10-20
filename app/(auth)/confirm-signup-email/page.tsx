import { Suspense } from "react"
import type { Metadata } from "next"
import { ConfirmEmailForm } from "./_components/confirm-email-form"

export const metadata: Metadata = {
  title: "Confirm Email",
  description: "Verify your email address to activate your Fakebook account.",
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <ConfirmEmailForm />
    </Suspense>
  )
}
