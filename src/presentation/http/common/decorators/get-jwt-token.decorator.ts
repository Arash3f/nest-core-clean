import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import { getJwtFromRequest } from "@presentation/http/common/utils/jwt-extract.util"
import type { Request } from "express"

/**
 * Custom decorator that extracts the JWT token from an HTTP request.
 *
 * @description
 * This decorator retrieves the JWT token from the incoming request by checking
 * common locations where tokens are typically stored (headers, cookies, etc.).
 *
 * @param _data - Unused parameter (required by NestJS decorator signature)
 * @param context - NestJS execution context providing access to the HTTP request
 * @returns The extracted JWT token as a string, or `undefined` if no token is found
 *
 * @example
 * Basic usage in a controller:
 * ```ts
 * \@Controller('auth')
 * export class AuthController {
 *   \@Get('profile')
 *   getProfile(@GetJwtToken() token: string) {
 *     // Use the JWT token to fetch user profile
 *     return { token, message: 'Profile retrieved' };
 *   }
 * }
 * ```
 *
 * @example
 * Using with authentication guard:
 * ```ts
 * \@Injectable()
 * export class JwtAuthGuard {
 *   canActivate(context: ExecutionContext): boolean {
 *     const token = GetJwtToken()(undefined, context);
 *     if (!token) throw new UnauthorizedException();
 *     // Verify token logic...
 *     return true;
 *   }
 * }
 * ```
 *
 * @example
 * Using in middleware:
 * ```ts
 * \@Injectable()
 * export class JwtLoggerMiddleware {
 *   use(req: Request, res: Response, next: NextFunction) {
 *     const token = GetJwtToken()(undefined, { switchToHttp: () => ({ getRequest: () => req }) } as any);
 *     console.log(`Request with JWT: ${token ? 'Present' : 'Missing'}`);
 *     next();
 *   }
 * }
 * ```
 *
 * @remarks
 * The decorator relies on the `getJwtFromRequest` helper function which typically checks:
 * - `Authorization: Bearer <token>` header
 * - `x-access-token` header
 * - Cookies (if configured)
 */
export const GetJwtToken = createParamDecorator<string>(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>()
    return getJwtFromRequest(req)
  },
)
