import type { IdInput } from "@application/common/id.input"
import type { MeOutput } from "@application/user/use-cases/me/me.output"
import { DomainException } from "@domain/common/errors/domain.exception"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(requesterId: IdInput): Promise<MeOutput> {
    const user = await this.usersRepo.findById(requesterId.id)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    return {
      id: user.id,
      username: user.name,
      name: user.name,
      active: user.active,
      role: user.role,
    }
  }
}
