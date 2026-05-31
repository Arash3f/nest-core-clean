import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { UpdateUserInput } from "@application/user/use-cases/update-user/update-user.input"

export const UPDATE_USER_USE_CASE = Symbol("UPDATE_USER_USE_CASE")

export interface UpdateUserUseCasePort {
  execute(input: UpdateUserInput): Promise<UserSimpleModel>
}
