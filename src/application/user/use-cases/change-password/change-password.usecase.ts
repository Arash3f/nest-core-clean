import type { SuccessOutput } from "@application/common/success.output"
import type { ChangePasswordInput } from "@application/user/use-cases/change-password/change-password.input"
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
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(input: ChangePasswordInput): Promise<SuccessOutput> {
    const user = await this.usersRepo.findById(input.where.id)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    const hash = await this.hasher.hash(input.data.newPassword)
    await this.usersRepo.updatePassword(input.where.id, hash)

    return { success: true }
  }
}
