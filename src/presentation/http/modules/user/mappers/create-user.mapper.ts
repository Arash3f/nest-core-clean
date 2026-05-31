import type { UserSimpleModel } from "@application/user/models/user-simple.model"

export class CreateUserMapper {
  static toDto(output: UserSimpleModel): UserSimpleModel {
    return {
      id: output.id,
      username: output.username,
      name: output.name,
      active: output.active,
      role: output.role,
    }
  }
}
