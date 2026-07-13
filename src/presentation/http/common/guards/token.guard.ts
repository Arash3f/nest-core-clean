import type { Role } from "@domain/common/value-objects/role.value-object"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { getRequest } from "@presentation/common/utils/get-request.util"
import { RequestUser, TokenContext } from "@presentation/http/common/types/request.type"
import { getDeviceFingerprint } from "@presentation/http/common/utils/device-fingerprint.util"
import { getJwtFromRequest } from "@presentation/http/common/utils/jwt-extract.util"

type JwtPayload = {
  id: string
  role: Role
  username?: string
  deviceId?: string
  iat?: number
  exp?: number
}

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context)

    req.tokenContext = { kind: "anonymous" }

    const token = getJwtFromRequest(req)
    if (!token) return true

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)

      if (!payload.deviceId || payload.deviceId !== getDeviceFingerprint(req)) {
        return true
      }

      const user: RequestUser = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      }

      const tokenContext: TokenContext = {
        kind: "authenticated",
        user,
        payload: {
          iat: payload.iat,
          exp: payload.exp,
        },
      }

      req.user = user
      req.tokenContext = tokenContext
    } catch (error) {
      const err = error as Error

      req.tokenContext = {
        kind: "invalid",
        error: {
          name: err.name || "JwtError",
          message: err.message || "Invalid token",
        },
      }
    }

    return true
  }
}
