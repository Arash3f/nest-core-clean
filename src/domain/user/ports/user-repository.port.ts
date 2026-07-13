import type { User } from "@domain/user/entities/user.entity"
import type { CreateUserType, SearchUsersType, UpdateUserType } from "@domain/user/user.types"

export const USER_REPOSITORY_PORT = Symbol("USER_REPOSITORY_PORT")

export interface UsersRepositoryPort {
  findById(id: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(data: CreateUserType): Promise<User>
  update(id: string, data: UpdateUserType): Promise<User>
  delete(id: string): Promise<boolean>
  updatePassword(id: string, passwordHash: string): Promise<boolean>
  setRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void>
  search(data: SearchUsersType): Promise<{ count: number; data: User[] }>
  findAll(): Promise<User[]>
}
