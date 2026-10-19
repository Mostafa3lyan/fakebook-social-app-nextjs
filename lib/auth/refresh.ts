import { clearSessionTokens, setSessionTokens } from "./session"
import { AuthCredentials } from "@/lib/types"

let activeRefreshPromise: Promise<AuthCredentials | null> | null = null

/**
 * Deduplicated token rotation.
 * Ensures only ONE refresh call is in flight across concurrent requests.
 * Respects backend rules:
 * - Sends Refresh Token in Authorization header.
 * - Handles 409 Conflict (Current Access token still valid).
 * - Updates httpOnly cookies upon success.
 * - Clears cookies if refresh token is rejected or revoked.
 */
export async function rotateTokens(
  currentRefreshToken: string,
  currentAccessToken?: string | null
): Promise<AuthCredentials | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise
  }

  activeRefreshPromise = (async () => {
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3000"

      const response = await fetch(`${backendUrl}/user/rotate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentRefreshToken}`,
        },
      })

      // Backend 409: Access token has > 30s remaining validity
      if (response.status === 409) {
        if (currentAccessToken) {
          return {
            access_token: currentAccessToken,
            refresh_token: currentRefreshToken,
          }
        }
      }

      if (!response.ok) {
        await clearSessionTokens()
        return null
      }

      const payload = await response.json()
      const data = payload?.data as AuthCredentials | undefined

      if (!data?.access_token || !data?.refresh_token) {
        await clearSessionTokens()
        return null
      }

      // Persist newly rotated credentials in cookies
      await setSessionTokens(data)
      return data
    } catch (err) {
      console.error("[Token Rotation Error]", err)
      return null
    } finally {
      activeRefreshPromise = null
    }
  })()

  return activeRefreshPromise
}
