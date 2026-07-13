import type { ExecutionContext } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { type GqlContextType, GqlExecutionContext } from "@nestjs/graphql"
import { ThrottlerGuard } from "@nestjs/throttler"
import type { Request, Response } from "express"

/**
 * ThrottlerGuard adapted for GraphQL + Express.
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): {
    req: Record<string, unknown>
    res: Record<string, unknown>
  } {
    if (context.getType<GqlContextType>() === "graphql") {
      const ctx = GqlExecutionContext.create(context).getContext<{
        req: Request
        res: Response
      }>()

      return {
        req: ctx.req as unknown as Record<string, unknown>,
        res: ctx.res as unknown as Record<string, unknown>,
      }
    }

    const http = context.switchToHttp()
    return {
      req: http.getRequest<Request>() as unknown as Record<string, unknown>,
      res: http.getResponse<Response>() as unknown as Record<string, unknown>,
    }
  }
}
