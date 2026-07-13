import { USER_READER_PORT, type UserReaderPort } from "@application/common/ports/user-reader.port"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { DomainException } from "@domain/common/errors/domain.exception"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Inject, Injectable } from "@nestjs/common"
import { getRequest } from "@presentation/common/utils/get-request.util"

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(
    @Inject(USER_READER_PORT)
    private readonly userReader: UserReaderPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context)

    if (!request.user) {
      throw new DomainException(AuthErrors.UserIsNotAuthorized)
    }

    const user = await this.userReader.findActiveById(request.user.id)
    if (!user) {
      throw new DomainException(AuthErrors.UserIsNotAuthorized)
    }

    request.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    }

    return true
  }
}
