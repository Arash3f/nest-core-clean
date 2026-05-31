import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { Request } from "express"

import { getJwtFromRequest } from "../utils/jwt-extract.util"

export const GetJwtToken = createParamDecorator<string>(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>()
    return getJwtFromRequest(req)
  },
)
