import { UserSimpleModel } from "@application/user/models/user-simple.model"
import { USER_REPOSITORY_PORT, UsersRepositoryPort } from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class ReadUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(): Promise<UserSimpleModel[]> {
    const users = await this.usersRepo.findAll()

    const mapped = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        active: user.active,
        role: user.role,
      }
    })

    return mapped
  }
}
