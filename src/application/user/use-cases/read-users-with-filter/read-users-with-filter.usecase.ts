import { ReadUsersWithFilterInput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.input"
import { ReadUsersWithFilterMapper } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.mapper"
import { ReadUsersWithFilterOutput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.output"
import { USER_REPOSITORY_PORT, UsersRepositoryPort } from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class ReadUsersWithFilterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(input: ReadUsersWithFilterInput): Promise<ReadUsersWithFilterOutput> {
    const response = await this.usersRepo.search(ReadUsersWithFilterMapper.toRepoData(input))

    const users = response.data.map((res) => {
      return {
        id: res.id,
        username: res.name,
        name: res.name,
        active: res.active,
        role: res.role,
      }
    })

    return { count: response.count, data: users }
  }
}
