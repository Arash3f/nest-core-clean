import type { Role } from "@domain/common/value-objects/role.value-object"

export const USER_READER_PORT = Symbol("USER_READER_PORT")

export type UserReaderPort = {
  findActiveById(id: string): Promise<{
    id: string
    username?: string
    role: Role
  } | null>
}
