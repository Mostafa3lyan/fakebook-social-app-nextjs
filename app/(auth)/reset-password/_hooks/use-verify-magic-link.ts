import * as React from "react"
import { authService } from "@/services"
import { getErrorMessage } from "@/lib/api/errors"

export function useVerifyMagicLink(initialToken: string) {
  const isJwtMagicLink = initialToken ? initialToken.split(".").length === 3 : false
  const [activeResetToken, setActiveResetToken] = React.useState<string>(
    isJwtMagicLink ? "" : initialToken
  )
  const [isVerifying, setIsVerifying] = React.useState<boolean>(isJwtMagicLink)
  const [linkError, setLinkError] = React.useState<string | null>(
    initialToken ? null : "No reset token provided. Please request a new password reset."
  )

  React.useEffect(() => {
    if (!initialToken || !isJwtMagicLink) return

    let isMounted = true

    authService
      .verifyMagicLink(initialToken)
      .then((res) => {
        if (!isMounted) return
        const resolved = res?.data?.resetToken
        if (resolved) {
          setActiveResetToken(resolved)
        } else {
          setLinkError("Invalid magic link response from server.")
        }
      })
      .catch((err) => {
        if (!isMounted) return
        setLinkError(getErrorMessage(err, "This magic reset link is invalid or has expired."))
      })
      .finally(() => {
        if (isMounted) setIsVerifying(false)
      })

    return () => {
      isMounted = false
    }
  }, [initialToken, isJwtMagicLink])

  return {
    isVerifying,
    activeResetToken,
    linkError,
  }
}
