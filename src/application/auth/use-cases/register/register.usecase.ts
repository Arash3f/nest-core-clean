import type { LoginOutput } from "@application/auth/use-cases/login/login.output"
import {
  LOGIN_USE_CASE,
  type LoginUseCasePort,
} from "@application/auth/use-cases/login/login-usecase.port"
import type { RegisterInput } from "@application/auth/use-cases/register/register.input"
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from "@domain/auth/ports/password-hasher.port"
import { DomainException } from "@domain/common/errors/domain.exception"
import { Role } from "@domain/common/value-objects/role.value-object"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,

    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCasePort,
  ) {}

  async execute(input: RegisterInput): Promise<LoginOutput> {
    const username = input.username.toLowerCase()

    const dup = await this.usersRepo.findByUsername(username)
    if (dup) throw new DomainException(UserErrors.UsernameIsDuplicated)

    const passwordHash = await this.hasher.hash(input.password)

    await this.usersRepo.create({
      name: input.name,
      username,
      passwordHash,
      role: Role.Member,
    })

    return this.loginUseCase.execute({
      username,
      password: input.password,
      deviceId: input.deviceId,
    })
  }
}
