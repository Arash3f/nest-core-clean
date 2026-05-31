import type { SuccessOutput } from "@application/common/success.output"
import type { ChangePasswordInput } from "@application/user/use-cases/change-password/change-password.input"

export const CHANGE_PASSWORD_USER_USE_CASE = Symbol("CHANGE_PASSWORD_USER_USE_CASE")

export interface ChangePasswordUseCasePort {
  execute(input: ChangePasswordInput): Promise<SuccessOutput>
}
