"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, MailCheck, RotateCcw } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { AuthCard } from "@/components/shared/auth-card"
import { ErrorComponent } from "@/components/shared/error-component"
import { useResendTimer } from "@/hooks/use-resend-timer"
import { useConfirmEmail } from "../_hooks/use-confirm-email"
import { useResendConfirmation } from "../_hooks/use-resend-confirmation"

export function ConfirmEmailForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = React.useState("")
  const { timeLeft, canResend, startTimer } = useResendTimer("confirm_email_timer", 60)

  const { isPending: isConfirming, error, confirmEmail } = useConfirmEmail()

  const {
    isPending: isResending,
    resendConfirmation,
  } = useResendConfirmation({
    onCooldown: (seconds) => startTimer(seconds),
  })

  const submit = (code: string) => {
    if (!email || code.length !== 6 || isConfirming) return
    confirmEmail(
      { email, otp: code },
      { onError: () => setOtp("") }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(otp)
  }

  const handleResend = () => {
    if (!email || !canResend || isResending) return
    setOtp("")
    resendConfirmation(email)
  }

  return (
    <AuthCard
      title="Verify Your Email"
      description={
        email
          ? `We sent a 6-digit verification code to ${email}`
          : "Enter the 6-digit verification code sent to your email."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-3 py-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={submit}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            disabled={isConfirming}
            aria-label="6-digit verification code"
          >
            {[...Array(6)].map((_, i) => (
              <InputOTPGroup key={i} className="p-1">
                <InputOTPSlot index={i} />
              </InputOTPGroup>
            ))}
          </InputOTP>
        </div>

        {error && <ErrorComponent errorMessage={error.message} />}

        <Button
          type="submit"
          className="w-full font-semibold shadow-sm min-h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          disabled={isConfirming || otp.length !== 6}
        >
          {isConfirming ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
              Verifying...
            </>
          ) : (
            <>
              <MailCheck className="size-4 mr-2" aria-hidden="true" />
              Confirm Email
            </>
          )}
        </Button>

        {/* Resend Cooldown Section */}
        <div className="flex items-center justify-center pt-2 text-center text-sm">
          {canResend ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending || !email}
              className="text-primary hover:text-primary/90 min-h-11 px-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {isResending ? (
                <>
                  <Loader2 className="size-3.5 mr-2 animate-spin" aria-hidden="true" />
                  Sending code...
                </>
              ) : (
                <>
                  <RotateCcw className="size-3.5 mr-2" aria-hidden="true" />
                  Resend verification code
                </>
              )}
            </Button>
          ) : (
            <p className="text-muted-foreground text-xs" aria-live="polite">
              Resend available in{" "}
              <span className="font-semibold text-foreground">{timeLeft}s</span>
            </p>
          )}
        </div>
      </form>
    </AuthCard>
  )
}
