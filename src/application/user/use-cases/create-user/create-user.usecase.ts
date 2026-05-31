import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { CreateUserInput } from "@application/user/use-cases/create-user/create-user.input"
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
import type { CreateUserType } from "@domain/user/user.types"
import { Inject } from "@nestjs/common"

export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(input: CreateUserInput): Promise<UserSimpleModel> {
    const username = input.username.toLowerCase()

    const dup = await this.usersRepo.findByUsername(username)
    if (dup) throw new DomainException(UserErrors.UsernameIsDuplicated)

    const passwordHash = await this.hasher.hash(input.password)

    const data: CreateUserType = {
      name: input.name,
      username,
      passwordHash: passwordHash,
      role: input.role,
    }

    const user = await this.usersRepo.create(data)

    return {
      id: user.id,
      username: user.name,
      name: user.name,
      active: user.active,
      role: user.role,
    }
  }
}
