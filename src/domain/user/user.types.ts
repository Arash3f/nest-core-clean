import type { PaginationType } from "@domain/common/types/pagination.type"
import type { SortByType } from "@domain/common/types/sort-by.type"
import type { Role } from "@domain/common/value-objects/role.value-object"

export interface CreateUserType {
  username: string
  passwordHash: string
  name: string
  active?: boolean
  role?: Role
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface UpdateUserType {
  name?: string
  username?: string
  active?: boolean
  role?: Role
}

export interface SearchUsersType {
  where: {
    id?: string
    username?: string
    name?: string
    role?: Role
    active?: boolean
  }
  pagination?: PaginationType
  sortBy?: SortByType
}
