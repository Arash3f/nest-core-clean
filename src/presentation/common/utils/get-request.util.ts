import type { ExecutionContext } from "@nestjs/common"
import { type GqlContextType, GqlExecutionContext } from "@nestjs/graphql"
import type { AuthenticatedRequest } from "@presentation/http/common/types/request.type"

/**
 * Resolves the underlying HTTP request from either a GraphQL or HTTP execution context.
 *
 * @remarks
 * GraphQL resolvers expose the Express request on the Apollo context (`ctx.req`).
 * Plain HTTP routes (e.g. REST / health) use Nest's standard HTTP switch.
 */
export function getRequest(context: ExecutionContext): AuthenticatedRequest {
  if (context.getType<GqlContextType>() === "graphql") {
    return GqlExecutionContext.create(context).getContext<{ req: AuthenticatedRequest }>().req
  }

  return context.switchToHttp().getRequest<AuthenticatedRequest>()
}
