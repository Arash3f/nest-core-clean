import type { Role } from "@domain/common/value-objects/role.value-object"

export type AccessTokenPayload = {
  sub: string
  role: Role
  username?: string
}
