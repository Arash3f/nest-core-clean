import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { UpdateMeInput } from "@application/user/use-cases/update-me/update-me.input"

export const UPDATE_ME_USE_CASE = Symbol("UPDATE_ME_USE_CASE")

export interface UpdateMeUseCasePort {
  execute(input: UpdateMeInput): Promise<UserSimpleModel>
}
