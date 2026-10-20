import type { Metadata } from "next"
import { SignupForm } from "./_components/signup-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for Fakebook and connect with your friends.",
}

export default function SignupPage() {
  return <SignupForm />
}
