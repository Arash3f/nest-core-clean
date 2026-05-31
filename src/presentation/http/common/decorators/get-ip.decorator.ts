import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { Request } from "express"

type GetIpOptions = {
  trustProxyHeaders?: boolean
}

function normalizeIp(raw: unknown): string {
  const ip = typeof raw === "string" ? raw.trim() : ""
  if (!ip) return ""
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip
}

function firstIpFromXForwardedFor(xff: unknown): string {
  if (typeof xff !== "string") return ""
  return xff.split(",")[0]?.trim() ?? ""
}

export const GetIp = createParamDecorator(
  (options: GetIpOptions | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>()

    if (options?.trustProxyHeaders) {
      const cfConnectingIp = normalizeIp(req.headers["cf-connecting-ip"])
      if (cfConnectingIp) return cfConnectingIp

      const xRealIp = normalizeIp(req.headers["x-real-ip"])
      if (xRealIp) return xRealIp

      const xForwardedFor = normalizeIp(firstIpFromXForwardedFor(req.headers["x-forwarded-for"]))
      if (xForwardedFor) return xForwardedFor
    }

    return normalizeIp(req.ip)
  },
)
