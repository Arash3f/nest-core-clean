import { USER_READER_PORT, type UserReaderPort } from "@application/common/ports/user-reader.port"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { DomainException } from "@domain/common/errors/domain.exception"
import { Role } from "@domain/common/value-objects/role.value-object"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Inject, Injectable } from "@nestjs/common"
import { getRequest } from "@presentation/common/utils/get-request.util"

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    @Inject(USER_READER_PORT)
    private readonly userReader: UserReaderPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context)

    if (!req.user) {
      throw new DomainException(AuthErrors.UserIsNotAuthorized)
    }

    const user = await this.userReader.findActiveById(req.user.id)
    if (!user || user.role !== Role.Admin) {
      throw new DomainException(AuthErrors.AccessDenied)
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    }

    return true
  }
}
