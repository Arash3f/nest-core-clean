import type { Role } from "@domain/common/value-objects/role.value-object"

export type CreateUserInput = {
  name: string
  username: string
  password: string
  role: Role
}
