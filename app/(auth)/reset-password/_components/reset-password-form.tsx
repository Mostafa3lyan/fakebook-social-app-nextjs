"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/shared/password-input"
import { AuthCard } from "@/components/shared/auth-card"
import { ErrorComponent } from "@/components/shared/error-component"
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/lib/schemas/auth.schema"
import { useResetPassword } from "../_hooks/use-reset-password"
import { useVerifyMagicLink } from "../_hooks/use-verify-magic-link"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const initialToken = searchParams.get("token") || ""

  const { isVerifying, activeResetToken, linkError } = useVerifyMagicLink(initialToken)
  const { isPending: isResetting, error: resetError, resetPassword } = useResetPassword()

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      resetToken: activeResetToken,
      password: "",
      confirmPassword: "",
    },
  })

  // Synchronize resetToken when resolved
  React.useEffect(() => {
    if (activeResetToken) {
      form.setValue("resetToken", activeResetToken)
    }
  }, [activeResetToken, form])

  const onSubmit = (values: ResetPasswordSchemaType) => {
    resetPassword(values)
  }

  if (isVerifying) {
    return (
      <AuthCard title="Verifying Reset Link" description="Please wait while we validate your link...">
        <div className="flex flex-col items-center justify-center space-y-3 py-8" role="status" aria-live="polite">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Checking security signature...</p>
        </div>
      </AuthCard>
    )
  }

  if (linkError && !activeResetToken) {
    return (
      <AuthCard
        title="Invalid Reset Link"
        description="The password reset link is invalid or has expired."
        footer={
          <Button asChild className="w-full min-h-11">
            <Link href="/forgot-password" className="flex items-center justify-center">
              Request a New Link
            </Link>
          </Button>
        }
      >
        <div className="space-y-4 py-2">
          <ErrorComponent errorMessage={linkError} />
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Create New Password"
      description="Choose a strong, unique password to secure your account."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm p-1 inline-block"
          >
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            disabled={isResetting}
            aria-invalid={!!form.formState.errors.password}
            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p id="password-error" role="alert" className="text-xs font-medium text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            disabled={isResetting}
            aria-invalid={!!form.formState.errors.confirmPassword}
            aria-describedby={form.formState.errors.confirmPassword ? "confirmPassword-error" : undefined}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert" className="text-xs font-medium text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {resetError && <ErrorComponent errorMessage={resetError.message} />}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full font-semibold shadow-sm min-h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          disabled={isResetting}
        >
          {isResetting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
              Resetting Password...
            </>
          ) : (
            <>
              <LockKeyhole className="size-4 mr-2" aria-hidden="true" />
              Reset Password
            </>
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
