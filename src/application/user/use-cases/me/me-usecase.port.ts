import type { IdInput } from "@application/common/id.input"
import type { MeOutput } from "@application/user/use-cases/me/me.output"

export const ME_USE_CASE = Symbol("ME_USE_CASE")

export interface MeUseCasePort {
  execute(requesterId: IdInput): Promise<MeOutput>
}
