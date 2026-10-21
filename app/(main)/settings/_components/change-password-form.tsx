"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"

import { ChangePasswordSchema, ChangePasswordSchemaType } from "@/lib/schemas/auth.schema"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/shared/password-input"
import { ErrorComponent } from "@/components/shared/error-component"
import { useChangePassword } from "../_hooks/use-change-password"

export function ChangePasswordForm() {
  const { changePassword, isPending, error, reset: resetMutation } = useChangePassword()

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit = (values: ChangePasswordSchemaType) => {
    resetMutation()
    changePassword(values, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading text-foreground">
          Change Password
        </CardTitle>
        <CardDescription>
          Ensure your account is protected with a strong, distinct password containing uppercase, lowercase, numbers, and symbols.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md" noValidate>
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">Current Password</Label>
            <PasswordInput
              id="oldPassword"
              placeholder="••••••••"
              disabled={isPending}
              autoComplete="current-password"
              aria-invalid={!!form.formState.errors.oldPassword}
              aria-describedby={form.formState.errors.oldPassword ? "oldPassword-error" : undefined}
              {...form.register("oldPassword")}
            />
            {form.formState.errors.oldPassword && (
              <p id="oldPassword-error" role="alert" className="text-xs font-medium text-destructive">
                {form.formState.errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              placeholder="••••••••"
              disabled={isPending}
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.newPassword}
              aria-describedby={form.formState.errors.newPassword ? "newPassword-error" : undefined}
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword && (
              <p id="newPassword-error" role="alert" className="text-xs font-medium text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmNewPassword"
              placeholder="••••••••"
              disabled={isPending}
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.confirmNewPassword}
              aria-describedby={form.formState.errors.confirmNewPassword ? "confirmNewPassword-error" : undefined}
              {...form.register("confirmNewPassword")}
            />
            {form.formState.errors.confirmNewPassword && (
              <p id="confirmNewPassword-error" role="alert" className="text-xs font-medium text-destructive">
                {form.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          {error && <ErrorComponent errorMessage={error.message} />}

          <Button
            type="submit"
            className="w-full sm:w-auto min-h-11 font-semibold cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                Updating Password...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" aria-hidden="true" />
                Update Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
