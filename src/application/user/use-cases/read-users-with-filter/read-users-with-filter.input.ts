import type { PaginationInput } from "@application/common/pagination.input"
import type { SortByInput } from "@application/common/sort-by.input"
import type { Role } from "@domain/common/value-objects/role.value-object"

export type ReadUsersWhereData = {
  id?: string
  username?: string
  name?: string
  role?: Role
  active?: boolean
}

export type ReadUsersWithFilterInput = {
  where?: ReadUsersWhereData
  pagination?: PaginationInput
  sortBy?: SortByInput
}
