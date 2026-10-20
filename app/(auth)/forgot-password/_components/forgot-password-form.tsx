"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2, Send, ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AuthCard } from "@/components/shared/auth-card"
import { ErrorComponent } from "@/components/shared/error-component"
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/lib/schemas/auth.schema"
import { useForgotPassword } from "../_hooks/use-forgot-password"

export function ForgotPasswordForm() {
  const { isPending, error, isMagicLinkSent, forgotPassword } = useForgotPassword()

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
      method: "otp",
    },
  })

  const onSubmit = (values: ForgotPasswordSchemaType) => {
    forgotPassword(values)
  }

  if (isMagicLinkSent) {
    return (
      <AuthCard
        title="Check Your Inbox"
        description="We've emailed you a magic password reset link."
        footer={
          <Button variant="ghost" asChild className="w-full min-h-11">
            <Link href="/login" className="flex items-center justify-center">
              <ArrowLeft className="size-4 mr-2" aria-hidden="true" />
              Back to Sign In
            </Link>
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">
            The link is valid for 15 minutes. Click the link in the email to set a new password.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Find Your Account"
      description="Enter your email to receive a recovery code or magic link."
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
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isPending}
            className="min-h-11"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p id="email-error" role="alert" className="text-xs font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Recovery Method Selection */}
        <div className="space-y-2">
          <Label id="recovery-method-label">Recovery Method</Label>
          <Controller
            control={form.control}
            name="method"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-labelledby="recovery-method-label"
                className="grid grid-cols-1 gap-2.5"
                disabled={isPending}
              >
                <div className="flex items-start space-x-3 rounded-lg border border-input p-3 min-h-11 hover:bg-accent/40 cursor-pointer">
                  <RadioGroupItem value="otp" id="method-otp" className="mt-0.5" />
                  <Label htmlFor="method-otp" className="cursor-pointer flex-1 font-normal">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                      <KeyRound className="size-4 text-primary" aria-hidden="true" />
                      6-Digit Security Code
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Receive an OTP to enter manually on the next screen.
                    </span>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 rounded-lg border border-input p-3 min-h-11 hover:bg-accent/40 cursor-pointer">
                  <RadioGroupItem value="link" id="method-link" className="mt-0.5" />
                  <Label htmlFor="method-link" className="cursor-pointer flex-1 font-normal">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                      <Mail className="size-4 text-primary" aria-hidden="true" />
                      Reset Link
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Receive a one-click password reset link in your inbox.
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
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
              Sending Request...
            </>
          ) : (
            <>
              <Send className="size-4 mr-2" aria-hidden="true" />
              Continue
            </>
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
