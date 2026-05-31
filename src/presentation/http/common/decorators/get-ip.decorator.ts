import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { Request } from "express"

/**
 * Options for {@link GetIp} decorator.
 */
export type GetIpOptions = {
  /**
   * Whether to trust proxy-related headers for resolving the client IP.
   *
   * @remarks
   * When enabled, the decorator will try these headers (in order):
   * 1) `cf-connecting-ip` (Cloudflare)
   * 2) `x-real-ip`
   * 3) `x-forwarded-for` (first IP in the list)
   *
   * If none are present, it falls back to `req.ip`.
   *
   * @defaultValue false
   */
  trustProxyHeaders?: boolean
}

/**
 * Normalizes raw IP values into a clean IPv4/IPv6 string.
 *
 * @remarks
 * - Accepts only string inputs; otherwise returns an empty string.
 * - Trims whitespace.
 * - Converts IPv4-mapped IPv6 (`::ffff:127.0.0.1`) into plain IPv4 (`127.0.0.1`).
 *
 * @param raw - Unknown value (commonly from headers or request fields).
 * @returns A normalized IP address, or an empty string if input is invalid.
 *
 * @internal
 */
function normalizeIp(raw: unknown): string {
  const ip = typeof raw === "string" ? raw.trim() : ""
  if (!ip) return ""
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip
}

/**
 * Extracts the first IP from an `X-Forwarded-For` header value.
 *
 * @remarks
 * The `X-Forwarded-For` header may contain a comma-separated list of IPs.
 * The first IP typically represents the original client.
 *
 * @param xff - Raw `x-forwarded-for` header value.
 * @returns The first IP address, or an empty string if input is invalid.
 *
 * @internal
 */
function firstIpFromXForwardedFor(xff: unknown): string {
  if (typeof xff !== "string") return ""
  return xff.split(",")[0]?.trim() ?? ""
}

/**
 * NestJS custom decorator that extracts the client's IP address from HTTP requests.
 *
 * @description
 * Provides flexible IP extraction with optional proxy header support for applications
 * running behind reverse proxies, load balancers, or CDNs.
 *
 * @param options - Configuration options (optional)
 * @param context - NestJS execution context
 * @returns Normalized client IP address string, or empty string if no valid IP is found
 *
 * @example
 * Basic usage (direct connection, no proxy headers):
 * ```ts
 * \@Controller('users')
 * export class UsersController {
 *   \@Get('me')
 *   getCurrentUser(@GetIp() clientIp: string) {
 *     return { ip: clientIp, message: 'User info retrieved' };
 *   }
 * }
 * ```
 *
 * @example
 * With proxy header trust (e.g., behind Cloudflare or Nginx):
 * ```ts
 * \@Controller('analytics')
 * export class AnalyticsController {
 *   \@Post('track')
 *   trackVisit(@GetIp({ trustProxyHeaders: true }) visitorIp: string) {
 *     return { tracked: true, ip: visitorIp };
 *   }
 * }
 * ```
 *
 * @example
 * Using with middleware or guards:
 * ```ts
 * \@Injectable()
 * export class RateLimitGuard {
 *   canActivate(context: ExecutionContext): boolean {
 *     const ip = GetIp({ trustProxyHeaders: true })(undefined, context);
 *     return true;
 *   }
 * }
 * ```
 */
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
