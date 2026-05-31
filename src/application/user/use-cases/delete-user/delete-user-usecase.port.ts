import type { IdInput } from "@application/common/id.input"
import type { SuccessOutput } from "@application/common/success.output"

export const DELETE_USER_USER_CASE = Symbol("DELETE_USER_USER_CASE")

export interface DeleteUserUseCasePort {
  execute(input: IdInput): Promise<SuccessOutput>
}
