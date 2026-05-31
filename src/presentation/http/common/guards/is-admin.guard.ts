import { Role } from "@domain/common/value-objects/role.value-object"
import type { CanActivate, ExecutionContext } from "@nestjs/common"
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthenticatedRequest } from "@presentation/http/common/types/express-auth-request.type"

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

    if (!req.user) {
      throw new UnauthorizedException()
    }

    if (req.user.role !== Role.Admin) {
      throw new ForbiddenException()
    }

    return true
  }
}
