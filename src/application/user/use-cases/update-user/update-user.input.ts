import type { IdInput } from "@application/common/id.input"
import type { Role } from "@domain/common/value-objects/role.value-object"

export type UpdateUserDataInput = {
  username?: string
  active?: boolean
  role?: Role
  name?: string
}

export type UpdateUserInput = {
  where: IdInput
  data: UpdateUserDataInput
}
