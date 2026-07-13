import type { IdInput } from "@application/common/id.input"
import type { SuccessOutput } from "@application/common/success.output"
import {
  USER_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from "@domain/user/ports/user-repository.port"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly usersRepo: UsersRepositoryPort,
  ) {}

  async execute(input: IdInput): Promise<SuccessOutput> {
    await this.usersRepo.setRefreshTokenHash(input.id, null)
    return { success: true }
  }
}
