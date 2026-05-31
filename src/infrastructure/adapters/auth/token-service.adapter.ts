import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenServicePort,
} from "@application/auth/ports/token-service.port"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvConfigService,
  ) {}

  async signAccessToken(payload: { sub: string; email?: string; role?: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.env.jwtAccessExpire,
    })
  }

  async signRefreshToken(payload: { sub: string; tokenVersion?: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.env.jwtRefreshExpire,
    })
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token, {})
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {})
  }
}
