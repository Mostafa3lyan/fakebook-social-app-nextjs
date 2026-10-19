/**
 * Guards post-auth redirects against open-redirect abuse.
 * Only same-origin, path-relative URLs are allowed.
 */
export function isSafeRelativeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")
}

/**
 * Returns `url` when safe to redirect to, otherwise default fallback.
 */
export function safeRedirectTarget(url: string | null | undefined, fallback = "/"): string {
  return isSafeRelativeUrl(url) ? (url as string) : fallback
}
