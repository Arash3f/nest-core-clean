import type {
  SignTokenInput,
  TokenPair,
  TokenPayload,
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

  async signTokenPair(payload: SignTokenInput): Promise<TokenPair> {
    const tokenPayload: TokenPayload = {
      id: payload.id,
      username: payload.username.toLowerCase(),
      deviceId: payload.deviceId,
      role: payload.role,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        expiresIn: this.env.jwtAccessExpire,
      }),
      this.jwtService.signAsync(tokenPayload, {
        expiresIn: this.env.jwtRefreshExpire,
      }),
    ])

    return { accessToken, refreshToken }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token)
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token)
  }
}
