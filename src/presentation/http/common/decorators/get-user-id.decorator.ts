import { createParamDecorator, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import type { AuthenticatedRequest } from "@presentation/http/common/types/express-auth-request.type"

export const GetUserId = createParamDecorator<string>(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

    const userId = req.user?.id

    if (!userId) {
      throw new UnauthorizedException()
    }

    return userId
  },
)
