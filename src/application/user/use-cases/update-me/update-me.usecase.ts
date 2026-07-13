import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { UpdateMeInput } from "@application/user/use-cases/update-me/update-me.input"
import { DomainException } from "@domain/common/errors/domain.exception"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"
import cleanDeep from "clean-deep"

@Injectable()
export class UpdateMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(input: UpdateMeInput): Promise<UserSimpleModel> {
    const user = await this.usersRepo.findById(input.userId)
    if (!user) throw new DomainException(UserErrors.UserNotFound)

    const username = input.username?.toLowerCase()
    if (username && username !== user.username) {
      const dup = await this.usersRepo.findByUsername(username)
      if (dup) throw new DomainException(UserErrors.UsernameIsDuplicated)
    }

    const updated = await this.usersRepo.update(
      input.userId,
      cleanDeep({
        name: input.name,
        username,
      }),
    )

    return {
      id: updated.id,
      username: updated.username,
      name: updated.name,
      active: updated.active,
      role: updated.role,
    }
  }
}
