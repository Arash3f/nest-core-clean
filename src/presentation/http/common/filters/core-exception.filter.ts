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
import type { Request, Response } from "express"
import { ModuleNames } from "src/constants"

type HttpExceptionResponseBody = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

type ErrorResponseBody = {
  path: string
  code: number
  module: ModuleNames
  message: string
  persianTranslation: string
  developerMessage?: string
  timestamp: string
  statusCode: number
  debugError?: unknown
}

@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CoreExceptionFilter.name)

  constructor(private readonly env: EnvConfigService) {}

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

    if (this.env.nodeEnv === NodeEnv.Production) {
      delete errorBody.debugError
      delete errorBody.developerMessage
    } else {
      this.logger.error({ exception, errorBody })
    }

    response.status(errorBody.statusCode).send({
      ...errorBody,
      statusCode: errorBody.statusCode,
    })
  }
}
