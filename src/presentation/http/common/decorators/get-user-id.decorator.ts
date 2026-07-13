import { createParamDecorator, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import type { AuthenticatedRequest } from "@presentation/http/common/types/request.type"

/**
 * Custom decorator that extracts the authenticated user's ID from the request.
 *
 * @description
 * This decorator retrieves the user ID from the authenticated request object.
 * It assumes that authentication middleware/guard has already populated `req.user`
 * with the authenticated user's information.
 *
 * @param _data - Unused parameter (required by NestJS decorator signature)
 * @param context - NestJS execution context providing access to the HTTP request
 * @returns The authenticated user's ID as a string
 *
 * @throws {UnauthorizedException} When no user ID is found in the request
 *
 * @example
 * Basic usage in a controller:
 * ```ts
 * /@Controller('users')
 * export class UsersController {
 *   /@Get('profile')
 *   getProfile(@GetUserId() userId: string) {
 *     return { userId, message: 'User profile retrieved' };
 *   }
 * }
 * ```
 *
 * @example
 * Using with role-based access control:
 * ```ts
 * /@Controller('admin')
 * export class AdminController {
 *   /@Delete('users/:id')
 *   deleteUser(
 *     /@GetUserId() currentUserId: string,
 *     /@Param('id') targetUserId: string
 *   ) {
 *     if (currentUserId === targetUserId) {
 *       throw new ForbiddenException('Cannot delete your own account');
 *     }
 *     return { deleted: true };
 *   }
 * }
 * ```
 *
 * @example
 * Using in a custom guard:
 * ```ts
 * /@Injectable()
 * export class OwnershipGuard implements CanActivate {
 *   canActivate(context: ExecutionContext): boolean {
 *     const userId = GetUserId()(undefined, context);
 *     const resourceId = context.switchToHttp().getRequest().params.id;
 *     return userId === resourceId;
 *   }
 * }
 * ```
 *
 * @example
 * Using with multiple decorators:
 * ```ts
 * /@Controller('posts')
 * export class PostsController {
 *   /@Post()
 *   createPost(
 *     /@GetUserId() userId: string,
 *     /@Body() createPostDto: CreatePostDto
 *   ) {
 *     return this.postsService.create(userId, createPostDto);
 *   }
 * }
 * ```
 *
 * @remarks
 * **Important:** This decorator requires that:
 * 1. Authentication is already performed (e.g., via JWT guard, session middleware)
 * 2. The request object has a `user` property with an `id` field
 * 3. The user ID is available before this decorator is called
 *
 * The decorator will throw `UnauthorizedException` if:
 * - `req.user` is undefined/null
 * - `req.user.id` is undefined/null/empty
 */
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
