import type { Role } from "@domain/common/value-objects/role.value-object"
import { User } from "@domain/user/entities/user.entity"
import type { Role as PrismaRole, User as PrismaUser } from "@prisma/client"

export class PrismaUserMapper {
  static toDomain(row: PrismaUser): User {
    const role = row.role as unknown as Role

    return new User(
      row.id,
      row.username,
      row.passwordHash,
      row.name,
      row.active,
      role,
      row.refreshTokenHash,
      row.createdAt,
      row.updatedAt,
    )
  }

  static toPrismaCreate(input: {
    username: string
    passwordHash: string
    name: string
    active?: boolean
    role: Role
  }): {
    username: string
    password: string
    name: string
    active: boolean
    role: PrismaRole
  } {
    return {
      username: input.username.toLowerCase(),
      password: input.passwordHash,
      name: input.name,
      active: input.active ?? true,
      role: input.role,
    }
  }
}
