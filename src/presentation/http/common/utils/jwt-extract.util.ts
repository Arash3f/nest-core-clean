import type { Request } from "express"

export function getJwtFromRequest(req: Request): string {
  const authorization = req.headers.authorization?.trim()
  if (!authorization) return ""

  const parts = authorization.split(/\s+/)

  if (parts.length === 1) {
    return parts[0].trim()
  }

  if (parts.length === 2) {
    const [scheme, token] = parts

    if (/^(bearer|jwt)$/i.test(scheme)) {
      return token.trim()
    }
  }

  return ""
}
