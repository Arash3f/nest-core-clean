import type { UserSimpleModel } from "@application/user/models/user-simple.model"

export type ReadUsersWithFilterOutput = {
  count: number
  data: UserSimpleModel[]
}
