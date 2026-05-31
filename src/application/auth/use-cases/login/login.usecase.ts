import {
  TOKEN_SERVICE_PORT,
  type TokenServicePort,
} from "@application/auth/ports/token-service.port"
import type { LoginInput } from "@application/auth/use-cases/login/login.input"
import type { LoginOutput } from "@application/auth/use-cases/login/login.output"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from "@domain/auth/ports/password-hasher.port"
import { DomainException } from "@domain/common/errors/domain.exception"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject } from "@nestjs/common"

export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const username = input.username.toLowerCase()

    const user = await this.usersRepo.findByUsername(username)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    const valid = await this.hasher.verify(user.passwordHash, input.password)
    if (!valid) throw new DomainException(AuthErrors.IncorrectUsernameOrPassword)

    const jwt = await this.tokenService.signAccessToken({
      sub: user.id,
      username: user.username,
      role: user.role,
    })
    return { jwt }
  }
}
