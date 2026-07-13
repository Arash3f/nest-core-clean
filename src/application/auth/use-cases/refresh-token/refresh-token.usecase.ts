import {
  TOKEN_SERVICE_PORT,
  type TokenServicePort,
} from "@application/auth/ports/token-service.port"
import type { LoginOutput } from "@application/auth/use-cases/login/login.output"
import type { RefreshTokenInput } from "@application/auth/use-cases/refresh-token/refresh-token.input"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from "@domain/auth/ports/password-hasher.port"
import { DomainException } from "@domain/common/errors/domain.exception"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(input: RefreshTokenInput): Promise<LoginOutput> {
    let payload: Awaited<ReturnType<TokenServicePort["verifyRefreshToken"]>>
    try {
      payload = await this.tokenService.verifyRefreshToken(input.refreshToken)
    } catch {
      throw new DomainException(AuthErrors.InValidRefreshToken)
    }

    if (payload.deviceId !== input.deviceId) {
      throw new DomainException(AuthErrors.DeviceMismatch)
    }

    const user = await this.usersRepo.findById(payload.id)
    if (!user || !user.active || !user.refreshTokenHash) {
      throw new DomainException(AuthErrors.UserIsNotAuthorized)
    }

    const isValid = await this.hasher.verify(user.refreshTokenHash, input.refreshToken)
    if (!isValid) {
      throw new DomainException(AuthErrors.InValidRefreshToken)
    }

    const tokens = await this.tokenService.signTokenPair({
      id: user.id,
      username: user.username,
      deviceId: input.deviceId,
      role: user.role,
    })

    const refreshTokenHash = await this.hasher.hash(tokens.refreshToken)
    await this.usersRepo.setRefreshTokenHash(user.id, refreshTokenHash)

    return tokens
  }
}
