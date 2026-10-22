/**
 * Resolves any media path, S3 key, or backend upload URL to a displayable URL.
 * Routes S3 and protected backend assets through the authenticated BFF proxy (/api/media/...).
 */
export function resolveMediaUrl(src?: unknown): string {
  if (!src) return ""

  // Handle object wrappers if any (e.g. { url: "..." })
  let raw = ""
  if (typeof src === "string") {
    raw = src.trim()
  } else if (typeof src === "object" && src !== null) {
    const obj = src as Record<string, unknown>
    raw = String(obj.url || obj.secure_url || obj.key || "").trim()
  }

  if (!raw) return ""

  // 1. Data URLs and Blob URLs
  if (raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw
  }

  // 2. Local public assets in Next.js public directory (e.g. /facebook.png, /icon.png)
  if (
    raw.startsWith("/") &&
    !raw.startsWith("/uploads/") &&
    !raw.startsWith("/api/media/")
  ) {
    return raw
  }

  // 3. Already routed through local media proxy
  if (raw.startsWith("/api/media/")) {
    return raw
  }

  // 4. Backend upload URLs (e.g. http://localhost:3000/uploads/... or /uploads/...)
  // Remove origin and leading /uploads/ or uploads/
  if (raw.includes("/uploads/") || raw.startsWith("uploads/")) {
    const cleanKey = raw
      .replace(/^https?:\/\/[^/]+\//, "")
      .replace(/^\/?uploads\//, "")
    return `/api/media/${cleanKey}`
  }

  // 5. External full HTTP/HTTPS URLs (e.g. Unsplash, external CDNs, Google avatars)
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw
  }

  // 6. S3 Key (e.g. Fakebook/posts/..., fakebook/posts/..., posts/..., users/...)
  const cleanKey = raw.replace(/^\/+/, "")
  return `/api/media/${cleanKey}`
}
