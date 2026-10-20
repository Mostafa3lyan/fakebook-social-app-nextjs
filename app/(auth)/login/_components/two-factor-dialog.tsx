"use client"

import * as React from "react"
import { Loader2, KeyRound } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ErrorComponent } from "@/components/shared/error-component"
import { useVerify2fa } from "../_hooks/use-verify-2fa"

interface TwoFactorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function TwoFactorDialog({ open, onOpenChange, email }: TwoFactorDialogProps) {
  const [otp, setOtp] = React.useState("")

  const { isPending, error, verify2fa } = useVerify2fa({
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOtp("")
    }
    onOpenChange(nextOpen)
  }

  const submit = (code: string) => {
    if (!email || code.length !== 6 || isPending) return
    verify2fa(
      { email, otp: code },
      { onError: () => setOtp("") }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(otp)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="two-factor-desc">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center text-xl font-bold font-heading">
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription id="two-factor-desc" className="text-center text-sm text-muted-foreground">
            We sent a 6-digit confirmation code to{" "}
            <strong className="text-foreground">{email}</strong>. Enter it below to complete sign-in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onComplete={submit}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              disabled={isPending}
              aria-label="6-digit two-factor authentication code"
            >
              {[...Array(6)].map((_, i) => (
                <InputOTPGroup key={i} className="p-1">
                  <InputOTPSlot index={i} />
                </InputOTPGroup>
              ))}
            </InputOTP>
          </div>

          {error && <ErrorComponent errorMessage={error.message} />}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto min-h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto font-semibold min-h-11"
              disabled={isPending || otp.length !== 6}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
