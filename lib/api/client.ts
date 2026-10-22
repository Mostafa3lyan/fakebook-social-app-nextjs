import { ApiError } from "./errors"
import { ApiErrorResponse, ApiResponse } from "@/lib/types"

export type ClientRequestConfig = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>
  params?: Record<string, unknown> | object
}

function buildUrl(
  endpoint: string,
  params?: Record<string, unknown> | object
): string {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  const url = new URL(`/api/backend/${normalizedEndpoint}`, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
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

/**
 * Type-safe client fetch wrapper for React Query and client components.
 * Calls the local BFF proxy (/api/backend/...) which manages session tokens and automatic rotation.
 */
export async function api<T = unknown>(
  endpoint: string,
  config: ClientRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, headers = {}, body, ...rest } = config

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  const requestHeaders = new Headers()

  if (!isFormData) {
    requestHeaders.set("Content-Type", "application/json")
  }

  Object.entries(headers).forEach(([key, value]) => {
    requestHeaders.set(key, value)
  })

  const targetUrl = buildUrl(endpoint, params)

  const res = await fetch(targetUrl, {
    ...rest,
    body,
    headers: requestHeaders,
    credentials: "same-origin",
  })

  const responseData = await parseResponseBody(res)

  if (!res.ok) {
    const errorPayload = responseData as ApiErrorResponse | null
    const message =
      errorPayload?.message ||
      res.statusText ||
      `Request failed with status ${res.status}`

    throw new ApiError(message, res.status, errorPayload?.cause)
  }

  return responseData as ApiResponse<T>
}

/**
 * Resolves any image asset identifier to a loadable URL.
 * Supports:
 * - External URLs (e.g. Google profile photos: https://...)
 * - Pre-signed S3 URLs (https://...)
 * - Internal S3 asset keys (fakebook/users/... or fakebook/posts/...) -> routed through /api/media/*
 */
export function resolveAssetUrl(assetKeyOrUrl?: string | null): string {
  if (!assetKeyOrUrl) return ""
  if (assetKeyOrUrl.startsWith("http://") || assetKeyOrUrl.startsWith("https://") || assetKeyOrUrl.startsWith("blob:")) {
    return assetKeyOrUrl
  }
  const cleanKey = assetKeyOrUrl.startsWith("/") ? assetKeyOrUrl.slice(1) : assetKeyOrUrl
  return `/api/media/${cleanKey}`
}
