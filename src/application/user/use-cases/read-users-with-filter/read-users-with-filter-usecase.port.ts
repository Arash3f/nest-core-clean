import type { ReadUsersWithFilterInput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.input"
import type { ReadUsersWithFilterOutput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.output"

export const READ_USERS_WITH_FILTER_USE_CASE = Symbol("READ_USERS_WITH_FILTER_USE_CASE")

export interface ReadUsersWithFilterUseCasePort {
  execute(input: ReadUsersWithFilterInput): Promise<ReadUsersWithFilterOutput>
}
