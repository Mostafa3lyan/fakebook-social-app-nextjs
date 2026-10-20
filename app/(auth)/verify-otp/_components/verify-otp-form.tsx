"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, KeyRound, RotateCcw } from "lucide-react"
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
import { useVerifyOtp } from "../_hooks/use-verify-otp"
import { useResendOtp } from "../_hooks/use-resend-otp"

export function VerifyOtpForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = React.useState("")
  const { timeLeft, canResend, startTimer } = useResendTimer("verify_otp_timer", 60)

  const { isPending: isVerifying, error, verifyOtp } = useVerifyOtp()

  const { isPending: isResending, resendOtp } = useResendOtp({
    onCooldown: (seconds) => startTimer(seconds),
  })

  const submit = (code: string) => {
    if (!email || code.length !== 6 || isVerifying) return
    verifyOtp(
      { email, otp: code },
      { onError: () => setOtp("") } // let the user type a fresh code
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(otp)
  }

  const handleResend = () => {
    if (!email || !canResend || isResending) return
    setOtp("")
    resendOtp(email)
  }

  return (
    <AuthCard
      title="Enter Verification Code"
      description={
        email
          ? `Please check your email (${email}) for a 6-digit verification code.`
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
            disabled={isVerifying}
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
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
              Verifying...
            </>
          ) : (
            <>
              <KeyRound className="size-4 mr-2" aria-hidden="true" />
              Continue
            </>
          )}
        </Button>

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