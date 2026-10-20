import * as React from "react"
import { AlertCircle } from "lucide-react"

interface ErrorComponentProps {
  errorMessage?: string | null
  className?: string
  id?: string
}

export function ErrorComponent({ errorMessage, className = "", id }: ErrorComponentProps) {
  if (!errorMessage) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      id={id}
      className={`flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/15 ${className}`}
    >
      <AlertCircle className="size-4 shrink-0 translate-y-0.5 text-destructive" aria-hidden="true" />
      <p className="flex-1 text-left font-medium leading-snug">{errorMessage}</p>
    </div>
  )
}

export default ErrorComponent
