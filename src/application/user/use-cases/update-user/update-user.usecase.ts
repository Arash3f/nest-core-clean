import { UserSimpleModel } from "@application/user/models/user-simple.model"
import { UpdateUserInput } from "@application/user/use-cases/update-user/update-user.input"
import { DomainException } from "@domain/common/errors/domain.exception"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { USER_REPOSITORY_PORT, UsersRepositoryPort } from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"
import cleanDeep from "clean-deep"

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(input: UpdateUserInput): Promise<UserSimpleModel> {
    const user = await this.usersRepo.findById(input.where.id)

    if (!user) {
      throw new DomainException(UserErrors.UserNotFound)
    }

    const username = input.data.username?.toLowerCase()
    if (username && username !== user.username) {
      const dup = await this.usersRepo.findByUsername(username)
      if (dup) throw new DomainException(UserErrors.UsernameIsDuplicated)
    }

    const updated = await this.usersRepo.update(
      user.id,
      cleanDeep({
        ...input.data,
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
