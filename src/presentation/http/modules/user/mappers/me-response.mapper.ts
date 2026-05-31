import type { UserSimpleModel } from "@application/user/models/user-simple.model"
import type { MeOutput } from "@application/user/use-cases/me/me.output"

export class MeMapper {
  static toDto(output: MeOutput): UserSimpleModel {
    return {
      id: output.id,
      username: output.username,
      name: output.name,
      active: output.active,
      role: output.role,
    }
  }
}
