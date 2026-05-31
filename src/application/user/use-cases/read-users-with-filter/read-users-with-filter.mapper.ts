import type { ReadUsersWithFilterInput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.input"
import type { SearchUsersType } from "@domain/user/user.types"

export class ReadUsersWithFilterMapper {
  static toRepoData(input: ReadUsersWithFilterInput): SearchUsersType {
    return {
      where: {
        id: input.where?.id,
        username: input.where?.username,
        name: input.where?.name,
        role: input.where?.role,
        active: input.where?.active,
      },
      pagination: {
        skip: input.pagination?.skip ?? 0,
        take: input.pagination?.take ?? 10,
      },
      sortBy: {
        field: input.sortBy?.field,
        descending: input.sortBy?.descending ?? true,
      },
    }
  }
}
