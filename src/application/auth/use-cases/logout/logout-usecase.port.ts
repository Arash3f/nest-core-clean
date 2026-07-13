import type { IdInput } from "@application/common/id.input"
import type { SuccessOutput } from "@application/common/success.output"

export const LOGOUT_USE_CASE = Symbol("LOGOUT_USE_CASE")

export interface LogoutUseCasePort {
  execute(input: IdInput): Promise<SuccessOutput>
}
