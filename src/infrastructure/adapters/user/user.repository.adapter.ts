import type { User } from "@domain/user/entities/user.entity"
import type { UsersRepositoryPort } from "@domain/user/ports/user-repository.port"
import type { CreateUserType, SearchUsersType, UpdateUserType } from "@domain/user/user.types"
import { toPrismaPagination } from "@infrastructure/adapters/user/mappers/prisma-pagination.mapper"
import { toPrismaOrderBy } from "@infrastructure/adapters/user/mappers/prisma-sort-by.mapper"
import { PrismaUserMapper } from "@infrastructure/adapters/user/mappers/prisma-user.mapper"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import type { Prisma } from "@prisma/client"
import cleanDeep from "clean-deep"

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } })
    return row ? PrismaUserMapper.toDomain(row) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { username: username.toLowerCase() } })
    return row ? PrismaUserMapper.toDomain(row) : null
  }

  async create(data: CreateUserType): Promise<User> {
    const row = await this.prisma.user.create({
      data,
    })

    return PrismaUserMapper.toDomain(row)
  }

  async update(id: string, data: UpdateUserType): Promise<User> {
    const row = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        username: data.username ? data.username.toLowerCase() : undefined,
      },
    })

    return PrismaUserMapper.toDomain(row)
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.update({
      where: { id },
      data: { active: false, refreshTokenHash: null },
    })
    return true
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })
    return rows.map((row) => PrismaUserMapper.toDomain(row))
  }

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash, refreshTokenHash: null },
    })
    return true
  }

  async setRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    })
  }

  async search(data: SearchUsersType): Promise<{ count: number; data: User[] }> {
    const rawWhere = data.where || {}

    let whereClause: Prisma.UserWhereInput = {
      id: rawWhere.id,
      active: rawWhere.active,
      username: {
        mode: "insensitive",
        contains: rawWhere.username,
      },
      name: { mode: "insensitive", contains: rawWhere.name },
      role: rawWhere.role,
    }

    whereClause = cleanDeep(whereClause)

    const count = await this.prisma.user.count({ where: whereClause })

    const rows = await this.prisma.user.findMany({
      where: whereClause,
      ...toPrismaOrderBy(data?.sortBy),
      ...toPrismaPagination(data?.pagination),
    })

    return {
      count,
      data: rows.map((row) => PrismaUserMapper.toDomain(row)),
    }
  }
}
