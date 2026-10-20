import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Fakebook account.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
