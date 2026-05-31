import type { UserSimpleModel } from "@application/user/models/user-simple.model"

export const READ_USERS_USE_CASE = Symbol("READ_USERS_USE_CASE")

export interface ReadUsersUseCasePort {
  execute(): Promise<UserSimpleModel[]>
}
