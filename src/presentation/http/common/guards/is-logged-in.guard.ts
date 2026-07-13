import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { getRequest } from "@presentation/common/utils/get-request.util"

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context)

    if (!request.user) {
      throw new UnauthorizedException("Authentication is required.")
    }

    return true
  }
}
