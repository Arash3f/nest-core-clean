import { DomainException } from "@domain/common/errors/domain.exception"
import { NodeEnv } from "@infrastructure/config/env.types"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common"
import {
  ErrorResponseBody,
  HttpExceptionResponseBody,
} from "@presentation/http/common/filters/core-exception.type"
import type { Request, Response } from "express"
import { ModuleNames } from "src/constants"

/**
 * Global exception filter that catches all unhandled exceptions and transforms them
 * into a standardized error response format.
 *
 * @description
 * This filter serves as the last line of defense for exception handling in the application.
 * It catches any exception that hasn't been handled by other filters or guards, and
 * transforms it into a consistent `ErrorResponseBody` format.
 *
 * Key features:
 * - Handles `DomainException` (business logic errors)
 * - Handles NestJS `HttpException` (HTTP-specific errors)
 * - Handles generic JavaScript `Error` objects
 * - Sanitizes error details in production environment
 * - Logs errors with context in non-production environments
 * - Provides Persian translations for domain exceptions
 *
 * @decorator `@Catch()` - Catches all exceptions (no specific type)
 *
 * @example
 * Register as global filter:
 * ```ts
 * // main.ts
 * import { CoreExceptionFilter } from './filters/core-exception.filter';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalFilters(app.get(CoreExceptionFilter));
 *   await app.listen(3000);
 * }
 * ```
 *
 * @example
 * Throwing DomainException (handled by this filter):
 * ```ts
 * throw new DomainException({
 *   message: 'User not found',
 *   persianTranslation: 'کاربر یافت نشد',
 *   statusCode: HttpStatus.NOT_FOUND,
 *   code: 1001,
 *   module: ModuleNames.UserModule
 * });
 * ```
 *
 * @example
 * Throwing NestJS HttpException (handled by this filter):
 * ```ts
 * throw new BadRequestException(['email is invalid', 'password too weak']);
 * // Transforms array messages into comma-separated string
 * ```
 *
 * @remarks
 * **Error Response Structure:**
 * - Successfully processed exceptions (DomainException, HttpException) preserve their
 *   specific status codes and messages
 * - Unknown exceptions are converted to 500 Internal Server Error
 * - In production (`NodeEnv.Production`), debug information is automatically stripped
 *
 * **Logging Behavior:**
 * - Production: Only minimal error response (no debug info)
 * - Development/Staging: Full error details logged and returned
 *
 * @see {@link DomainException} - Business logic exceptions
 */
@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CoreExceptionFilter.name)

  /**
   * Creates an instance of CoreExceptionFilter.
   *
   * @param env - Environment configuration service (used to check node environment)
   */
  constructor(private readonly env: EnvConfigService) {}

  /**
   * Main exception handling method called by NestJS when an exception occurs.
   *
   * @param exception - The caught exception (can be any type)
   * @param host - Arguments host providing access to HTTP context
   *
   * @remarks
   * **Exception Processing Priority:**
   * 1. DomainException (most specific, business logic)
   * 2. HttpException (NestJS HTTP exceptions)
   * 3. Error (generic JavaScript errors)
   * 4. string (raw error messages)
   * 5. unknown (fallback for any other type)
   *
   * **Environment Behavior:**
   * - Production: Removes `debugError` and `developerMessage` fields
   * - Non-Production: Logs full exception details and includes debug info
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const errorBody: ErrorResponseBody = {
      path: request.originalUrl ?? request.url,
      code: 9999,
      module: ModuleNames.DomainModule,
      message: "",
      persianTranslation: "",
      developerMessage: "",
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }

    /**
     * Handle DomainException (business logic errors)
     * Preserves all custom fields: message, translation, code, module
     */
    if (exception instanceof DomainException) {
      errorBody.message = exception.message
      errorBody.statusCode = exception.statusCode
      errorBody.persianTranslation = exception.persianTranslation
      errorBody.developerMessage = exception.developerMessage ?? ""
      errorBody.code = exception.code
      errorBody.module = exception.module
    } else if (exception instanceof HttpException) {
      /**
       * Handle NestJS HttpException
       * Extracts status code and response body (supports string or object)
       * Converts validation error arrays to comma-separated strings
       */
      errorBody.statusCode = exception.getStatus()

      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === "string") {
        errorBody.message = exceptionResponse
        errorBody.debugError = { message: exceptionResponse }
      } else {
        const responseBody = exceptionResponse as HttpExceptionResponseBody

        if (Array.isArray(responseBody.message)) {
          errorBody.message = responseBody.message.join(", ")
        } else if (typeof responseBody.message === "string") {
          errorBody.message = responseBody.message
        } else {
          errorBody.message = exception.message
        }

        errorBody.debugError = responseBody
      }
    } else if (exception instanceof Error) {
      /**
       * Handle standard JavaScript Error
       * Captures error name, message, and stack trace
       */
      errorBody.message = exception.message
      errorBody.debugError = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      }
    } else if (typeof exception === "string") {
      /**
       * Handle string exceptions
       * Some libraries or code may throw raw strings
       */
      errorBody.message = exception
      errorBody.debugError = {
        name: "Error",
        message: exception,
      }
    } else {
      /**
       * Fallback for unknown exception types
       * Ensures the application never crashes
       */
      errorBody.message = "Internal server error"
      errorBody.debugError = {
        value: exception,
      }
    }

    /**
     * Production environment sanitization
     * Removes sensitive debugging information
     */
    if (this.env.nodeEnv === NodeEnv.Production) {
      delete errorBody.debugError
      delete errorBody.developerMessage
    } else {
      // Non-production logging for debugging
      this.logger.error({ exception, errorBody })
    }

    response.status(errorBody.statusCode).send({
      ...errorBody,
      statusCode: errorBody.statusCode,
    })
  }
}
