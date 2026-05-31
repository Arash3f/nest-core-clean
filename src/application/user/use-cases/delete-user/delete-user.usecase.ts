import type { IdInput } from "@application/common/id.input"
import type { SuccessOutput } from "@application/common/success.output"
import { DomainException } from "@domain/common/errors/domain.exception"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(input: IdInput): Promise<SuccessOutput> {
    const user = await this.usersRepo.findById(input.id)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    await this.usersRepo.delete(input.id)
    return { success: true }
  }
}
