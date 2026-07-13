export type TokenPayload = {
  id: string
  username: string
  deviceId: string
  role?: string
  iat?: number
  exp?: number
}

export type SignTokenInput = {
  id: string
  username: string
  deviceId: string
  role?: string
}

export type TokenPair = {
  accessToken: string
  refreshToken: string
}

export const TOKEN_SERVICE_PORT = Symbol("TOKEN_SERVICE_PORT")

export interface TokenServicePort {
  signTokenPair(payload: SignTokenInput): Promise<TokenPair>
  verifyAccessToken(token: string): Promise<TokenPayload>
  verifyRefreshToken(token: string): Promise<TokenPayload>
}
