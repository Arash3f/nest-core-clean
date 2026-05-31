import type { Role } from "@domain/common/value-objects/role.value-object"

export type UserSimpleModel = {
  id: string
  username: string
  name: string
  active: boolean
  role: Role
}
