import type { Metadata } from "next"
import { ForgotPasswordForm } from "./_components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover access to your Fakebook account.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
