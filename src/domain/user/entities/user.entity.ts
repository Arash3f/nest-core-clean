import type { Role } from "@domain/common/value-objects/role.value-object"

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public passwordHash: string,
    public name: string,
    public active: boolean,
    public role: Role,
    public refreshTokenHash: string | null,
    public readonly createdDate: Date,
    public readonly updatedDate: Date,
  ) {}
}
