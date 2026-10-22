import { Suspense } from "react"
import type { Metadata } from "next"
import { RestoreAccountForm } from "./_components/restore-account-form"

export const metadata: Metadata = {
  title: "Restore Account",
  description: "Restore your deactivated Fakebook account within the 30-day grace period.",
}

export default function RestoreAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          Loading...
        </div>
      }
    >
      <RestoreAccountForm />
    </Suspense>
  )
}
