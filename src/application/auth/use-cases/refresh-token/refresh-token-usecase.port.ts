import type { LoginOutput } from "@application/auth/use-cases/login/login.output"
import type { RefreshTokenInput } from "@application/auth/use-cases/refresh-token/refresh-token.input"

export const REFRESH_TOKEN_USE_CASE = Symbol("REFRESH_TOKEN_USE_CASE")

export interface RefreshTokenUseCasePort {
  execute(input: RefreshTokenInput): Promise<LoginOutput>
}
