import type { ChangeMyPasswordInput } from "@application/auth/use-cases/change-my-password/change-my-password.input"
import type { SuccessOutput } from "@application/common/success.output"

export const CHANGE_MY_PASSWORD_USE_CASE = Symbol("CHANGE_MY_PASSWORD_USE_CASE")

export interface ChangeMyPasswordUseCasePort {
  execute(input: ChangeMyPasswordInput): Promise<SuccessOutput>
}
