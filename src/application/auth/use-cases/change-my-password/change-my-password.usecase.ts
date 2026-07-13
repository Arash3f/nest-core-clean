import type { ChangeMyPasswordInput } from "@application/auth/use-cases/change-my-password/change-my-password.input"
import type { SuccessOutput } from "@application/common/success.output"
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
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class ChangeMyPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(input: ChangeMyPasswordInput): Promise<SuccessOutput> {
    const user = await this.usersRepo.findById(input.userId)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    const valid = await this.hasher.verify(user.passwordHash, input.currentPassword)
    if (!valid) throw new DomainException(AuthErrors.IncorrectCurrentPassword)

    const passwordHash = await this.hasher.hash(input.newPassword)
    await this.usersRepo.updatePassword(input.userId, passwordHash)

    return { success: true }
  }
}
