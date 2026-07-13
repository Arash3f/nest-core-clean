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
import type { GqlContextType } from "@nestjs/graphql"
import {
  ErrorResponseBody,
  HttpExceptionResponseBody,
} from "@presentation/http/common/filters/core-exception.type"
import type { Request, Response } from "express"
import { GraphQLError } from "graphql"
import { ModuleNames } from "src/constants"

/**
 * Global exception filter that normalizes every thrown exception into a
 * consistent {@link ErrorResponseBody}.
 *
 * @remarks
 * - **GraphQL**: rethrows a `GraphQLError` whose `extensions.originalError`
 *   carries the body (Apollo always replies HTTP 200).
 * - **HTTP**: writes the body with the matching status code.
 */
@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CoreExceptionFilter.name)

  constructor(private readonly env: EnvConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const errorBody = this.normalize(exception, host)
    const isUnhandled = !(
      exception instanceof DomainException || exception instanceof HttpException
    )

    if (this.env.nodeEnv === NodeEnv.Production) {
      delete errorBody.debugError
      delete errorBody.developerMessage
      if (isUnhandled) {
        errorBody.message = "Internal server error"
      }
    } else {
      this.logger.error({ exception, errorBody })
    }

    if (host.getType<GqlContextType>() === "graphql") {
      throw new GraphQLError(errorBody.message, {
        extensions: { originalError: errorBody },
      })
    }

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(errorBody.statusCode).send({
      ...errorBody,
      statusCode: errorBody.statusCode,
    })
  }

  private normalize(exception: unknown, host: ArgumentsHost): ErrorResponseBody {
    const path =
      host.getType<GqlContextType>() === "graphql"
        ? "graphql"
        : (host.switchToHttp().getRequest<Request>().originalUrl ??
          host.switchToHttp().getRequest<Request>().url)

    const errorBody: ErrorResponseBody = {
      path,
      code: 9999,
      module: ModuleNames.DomainModule,
      message: "",
      persianTranslation: "",
      developerMessage: "",
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }

    if (exception instanceof DomainException) {
      errorBody.message = exception.message
      errorBody.statusCode = exception.statusCode
      errorBody.persianTranslation = exception.persianTranslation
      errorBody.developerMessage = exception.developerMessage ?? ""
      errorBody.code = exception.code
      errorBody.module = exception.module
    } else if (exception instanceof HttpException) {
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
      errorBody.message = exception.message
      errorBody.debugError = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      }
    } else if (typeof exception === "string") {
      errorBody.message = exception
      errorBody.debugError = {
        name: "Error",
        message: exception,
      }
    } else {
      errorBody.message = "Internal server error"
      errorBody.debugError = {
        value: exception,
      }
    }

    return errorBody
  }
}
