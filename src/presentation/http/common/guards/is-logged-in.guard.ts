import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthenticatedRequest } from "@presentation/http/common/types/express-auth-request.type"

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    if (!request.user) {
      throw new UnauthorizedException("Authentication is required.")
    }

    return true
  }
}
