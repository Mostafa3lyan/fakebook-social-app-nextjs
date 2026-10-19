import { ApiError } from "./errors"
import { getSessionTokens, isTokenExpiringSoon } from "@/lib/auth/session"
import { rotateTokens } from "@/lib/auth/refresh"
import { ApiErrorResponse, ApiResponse } from "@/lib/types"

interface BackendRequestConfig extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined | null>
  requireAuth?: boolean
}

async function parseResponseBody(res: Response): Promise<unknown> {
  if (res.status === 204 || res.status === 205) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function buildBackendUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const base = process.env.BACKEND_URL || "http://localhost:3000"
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = new URL(normalizedEndpoint, base)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    });
  }

  return url.toString()
}

/**
 * Server-only backend fetcher.
 * Automatically injects authorization headers, handles 401 token rotation,
 * and normalizes backend error responses into typed ApiError instances.
 */
export async function backendFetch<T = unknown>(
  endpoint: string,
  config: BackendRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { headers = {}, params, requireAuth = false, body, ...rest } = config

  const isRotateEndpoint = endpoint.includes("/user/rotate-token")
  let { accessToken, refreshToken } = await getSessionTokens()

  // Proactive token refresh if expiring within 30 seconds
  if (accessToken && refreshToken && !isRotateEndpoint && isTokenExpiringSoon(accessToken, 30)) {
    const refreshed = await rotateTokens(refreshToken, accessToken)
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token
      refreshToken = refreshed.refresh_token
    }
  }

  if (requireAuth && !accessToken) {
    throw new ApiError("Authentication required", 401)
  }

  const requestHeaders = new Headers()

  // Do not set Content-Type if body is FormData (browser/node will set boundary)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  if (!isFormData) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`)
  }

  // Merge custom headers
  Object.entries(headers).forEach(([key, value]) => {
    requestHeaders.set(key, value)
  })

  const targetUrl = buildBackendUrl(endpoint, params)

  let res = await fetch(targetUrl, {
    ...rest,
    body,
    headers: requestHeaders,
  })

  // Handle 401: Token expired or invalid session
  if (res.status === 401 && refreshToken && !isRotateEndpoint) {
    const refreshed = await rotateTokens(refreshToken)
    if (refreshed?.access_token) {
      requestHeaders.set("Authorization", `Bearer ${refreshed.access_token}`)
      res = await fetch(targetUrl, {
        ...rest,
        body,
        headers: requestHeaders,
      })
    }
  }

  const responseData = await parseResponseBody(res)

  if (!res.ok) {
    const errorPayload = responseData as ApiErrorResponse | null
    const message =
      errorPayload?.message ||
      res.statusText ||
      `Backend request failed with status ${res.status}`

    throw new ApiError(message, res.status, errorPayload?.cause)
  }

  return responseData as ApiResponse<T>
}
