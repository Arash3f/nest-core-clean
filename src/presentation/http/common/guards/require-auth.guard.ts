import { USER_READER_PORT, type UserReaderPort } from "@application/common/ports/user-reader.port"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import {
  AuthenticatedRequest,
  RequestUser,
} from "@presentation/http/common/types/request.type"

@Injectable()
export class RequireAuthGuard implements CanActivate {
  constructor(
    @Inject(USER_READER_PORT)
    private readonly userReader: UserReaderPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

    if (!req.tokenContext || req.tokenContext.kind !== "authenticated") {
      throw new UnauthorizedException()
    }

    const foundUser = await this.userReader.findActiveById(req.tokenContext.user.id)

    if (!foundUser) {
      throw new UnauthorizedException()
    }

    const requestUser: RequestUser = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role as RequestUser["role"],
    }

    req.user = requestUser

    return true
  }
}
