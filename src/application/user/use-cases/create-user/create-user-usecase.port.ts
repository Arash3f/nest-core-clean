import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { CreateUserInput } from "@application/user/use-cases/create-user/create-user.input"

export const CREATE_USER_USE_CASE = Symbol("CREATE_USER_USE_CASE")

export interface CreateUserUseCasePort {
  execute(input: CreateUserInput): Promise<UserSimpleModel>
}
