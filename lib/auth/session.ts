import { cookies } from "next/headers"

export const ACCESS_TOKEN_COOKIE = "fb_access_token"
export const REFRESH_TOKEN_COOKIE = "fb_refresh_token"

// 30 minutes for access token, 1 year for refresh token (matching backend)
const ACCESS_TOKEN_MAX_AGE = 30 * 60
const REFRESH_TOKEN_MAX_AGE = 365 * 24 * 60 * 60

export interface SessionTokens {
  accessToken: string | null
  refreshToken: string | null
}

export interface JwtPayloadBasic {
  sub?: string
  iat?: number
  exp?: number
  jti?: string
  aud?: [number, string]
}

/**
 * Decodes JWT payload without cryptographic verification (used on client/server for exp checks).
 */
export function decodeJwtPayload(token: string): JwtPayloadBasic | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
    return JSON.parse(decodedJson) as JwtPayloadBasic
  } catch {
    return null
  }
}

/**
 * Checks whether an access token will expire within the given threshold in seconds.
 */
export function isTokenExpiringSoon(token: string, thresholdSeconds = 30): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return payload.exp - now <= thresholdSeconds
}

/**
 * Server-side helper to read session tokens from cookies.
 */
export async function getSessionTokens(): Promise<SessionTokens> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null
  return { accessToken, refreshToken }
}

/**
 * Server-side helper to set session tokens in httpOnly cookies.
 */
export async function setSessionTokens(tokens: {
  access_token: string
  refresh_token: string
}): Promise<void> {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === "production"

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })

  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })
}

/**
 * Server-side helper to clear session cookies.
 */
export async function clearSessionTokens(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}
