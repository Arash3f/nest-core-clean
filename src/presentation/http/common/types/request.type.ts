import type { Role } from "@domain/common/value-objects/role.value-object"
import type { Request } from "express"

export type RequestUser = {
  id: string
  username?: string
  role: Role
}

export type TokenContext =
  | { kind: "anonymous" }
  | { kind: "invalid"; error: { name: string; message: string } }
  | {
      kind: "authenticated"
      user: RequestUser
      payload: { iat?: number; exp?: number }
    }

export type AuthenticatedRequest = Request & {
  tokenContext?: TokenContext
  user?: RequestUser
}
