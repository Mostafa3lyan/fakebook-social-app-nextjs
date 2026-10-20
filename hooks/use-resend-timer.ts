"use client"

import { useEffect, useState, useCallback } from "react"

export function useResendTimer(storageKey = "otp_resend_expires_at", defaultDuration = 60) {
  const [timeLeft, setTimeLeft] = useState(0)

  const readExpiresAt = useCallback(() => {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const val = Number(raw)
    return isNaN(val) ? null : val
  }, [storageKey])

  const startTimer = useCallback(
    (seconds = defaultDuration) => {
      const expiresAt = Date.now() + seconds * 1000
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, String(expiresAt))
      }
      setTimeLeft(seconds)
    },
    [defaultDuration, storageKey]
  )

  const clearTimer = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey)
    }
    setTimeLeft(0)
  }, [storageKey])

  useEffect(() => {
    const tick = () => {
      const expiresAt = readExpiresAt()
      if (!expiresAt) {
        setTimeLeft(0)
        return
      }

      const diff = Math.max(0, expiresAt - Date.now())
      const remainingSeconds = Math.ceil(diff / 1000)
      setTimeLeft(remainingSeconds)

      if (remainingSeconds === 0 && typeof window !== "undefined") {
        localStorage.removeItem(storageKey)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [readExpiresAt, storageKey])

  return {
    timeLeft,
    canResend: timeLeft === 0,
    startTimer,
    clearTimer,
  }
}
