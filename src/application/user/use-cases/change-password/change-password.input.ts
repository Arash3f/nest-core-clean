import type { IdInput } from "@application/common/id.input"

export type ChangePasswordDataInput = {
  newPassword: string
}

export type ChangePasswordInput = {
  where: IdInput
  data: ChangePasswordDataInput
}
