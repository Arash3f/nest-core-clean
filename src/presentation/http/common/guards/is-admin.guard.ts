import { Role } from "@domain/common/value-objects/role.value-object"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { getRequest } from "@presentation/common/utils/get-request.util"

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = getRequest(context)

    if (!req.user) {
      throw new UnauthorizedException()
    }

    if (req.user.role !== Role.Admin) {
      throw new ForbiddenException()
    }

    return true
  }
}
