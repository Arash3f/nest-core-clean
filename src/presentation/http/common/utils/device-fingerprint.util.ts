import { createHash } from "crypto"
import type { Request } from "express"

/**
 * Derives a stable device fingerprint for the incoming request from its
 * `User-Agent` header.
 *
 * @param req - The incoming Express request.
 * @returns The hex-encoded SHA-256 fingerprint of the request's `User-Agent`.
 */
export function getDeviceFingerprint(req: Request): string {
  const userAgent = req.headers["user-agent"] ?? ""
  return createHash("sha256").update(userAgent).digest("hex")
}
