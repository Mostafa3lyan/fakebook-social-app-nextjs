"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/shared/password-input"
import { AuthCard } from "@/components/shared/auth-card"
import { ErrorComponent } from "@/components/shared/error-component"
import {
  RestoreAccountSchema,
  RestoreAccountSchemaType,
} from "@/lib/schemas/auth.schema"
import { useRestoreAccount } from "../_hooks/use-restore-account"

export function RestoreAccountForm() {
  const { isPending, error, restoreAccount } = useRestoreAccount()

  const form = useForm<RestoreAccountSchemaType>({
    resolver: zodResolver(RestoreAccountSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: RestoreAccountSchemaType) => {
    restoreAccount(values)
  }

  return (
    <AuthCard
      title="Restore Your Account"
      description="Deactivated your account recently? Enter your credentials to restore your account and regain full access."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Remembered your password or want to sign in?{" "}
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
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="restore-email">Email Address</Label>
          <Input
            id="restore-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isPending}
            className="min-h-11"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={
              form.formState.errors.email ? "restore-email-error" : undefined
            }
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p
              id="restore-email-error"
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="restore-password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm p-1"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="restore-password"
            placeholder="••••••••"
            disabled={isPending}
            aria-invalid={!!form.formState.errors.password}
            aria-describedby={
              form.formState.errors.password ? "restore-password-error" : undefined
            }
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p
              id="restore-password-error"
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {error && <ErrorComponent errorMessage={error.message} />}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full font-semibold shadow-sm min-h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
              Restoring account...
            </>
          ) : (
            <>
              <RotateCcw className="size-4 mr-2" aria-hidden="true" />
              Restore Account
            </>
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
