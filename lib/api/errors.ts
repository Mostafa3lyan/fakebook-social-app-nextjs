import { ApiErrorCause, ApiErrorResponse } from "@/lib/types"

export class ApiError extends Error {
  status: number
  cause?: ApiErrorCause
  isOperational: boolean

  constructor(message: string, status: number, cause?: ApiErrorCause) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.cause = cause
    this.isOperational = status >= 400 && status < 500
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Extracts field-level validation errors from backend error response
 * structured by the backend's validation middleware:
 * cause: { error: [{ key: 'body', issues: [{ message: '...', path: ['fieldName'] }] }] }
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {}

  let cause: ApiErrorCause | undefined

  if (error instanceof ApiError) {
    cause = error.cause
  } else if (typeof error === "object" && error !== null) {
    const maybeApiErr = error as ApiErrorResponse
    cause = maybeApiErr.cause
  }

  if (!cause?.error || !Array.isArray(cause.error)) {
    return result
  }

  for (const group of cause.error) {
    if (group.key === "body" && Array.isArray(group.issues)) {
      for (const issue of group.issues) {
        // Find the leaf path name
        const fieldName = issue.path[issue.path.length - 1]
        if (fieldName && typeof fieldName === "string" && !result[fieldName]) {
          result[fieldName] = issue.message
        }
      }
    }
  }

  return result
}

/**
 * Safely extracts a user-friendly error message from any error shape.
 */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (typeof error === "string") return error
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message
    if (typeof msg === "string") return msg
  }
  return fallback
}
