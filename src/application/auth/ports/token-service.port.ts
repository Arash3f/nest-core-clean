export type AccessTokenPayload = {
  sub: string
  email?: string
  role?: string
  iat?: number
  exp?: number
}

export type RefreshTokenPayload = {
  sub: string
  tokenVersion?: number
  iat?: number
  exp?: number
}

export const TOKEN_SERVICE_PORT = Symbol("TOKEN_SERVICE_PORT")

export interface TokenServicePort {
  signAccessToken(payload: { sub: string; username?: string; role?: string }): Promise<string>
  signRefreshToken(payload: { sub: string; tokenVersion?: number }): Promise<string>

  verifyAccessToken(token: string): Promise<AccessTokenPayload>
  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>
}
