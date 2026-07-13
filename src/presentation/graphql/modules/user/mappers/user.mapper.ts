import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { MeOutput } from "@application/user/use-cases/me/me.output"
import type { UserModel } from "@presentation/graphql/modules/user/model/user.model"

export class UserGraphqlMapper {
  static fromMe(output: MeOutput): UserModel {
    return {
      id: output.id,
      username: output.username,
      name: output.name,
      active: output.active,
      role: output.role,
    }
  }

  static fromUser(output: UserSimpleModel): UserModel {
    return {
      id: output.id,
      username: output.username,
      name: output.name,
      active: output.active,
      role: output.role,
    }
  }
}
