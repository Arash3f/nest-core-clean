import type { DomainErrorDescriptor } from "@domain/common/errors/domain-error.interface"
import { applyDecorators } from "@nestjs/common"
import { ApiResponse } from "@nestjs/swagger"
import { AppExceptionResponseDto } from "@presentation/http/common/dto/error-response.dto"

/**
 * Groups errors by HTTP status code and creates Swagger documentation responses.
 *
 * @param errors - Array of domain error descriptors to document
 * @returns A combined decorator that applies all generated ApiResponse decorators
 */
export function apiErrorResponses(errors: DomainErrorDescriptor[]) {
  const groupedErrors = errors.reduce(
    (acc, error) => {
      if (!acc[error.statusCode]) {
        acc[error.statusCode] = []
      }
      acc[error.statusCode].push(error)
      return acc
    },
    {} as Record<number, DomainErrorDescriptor[]>,
  )

  const decorators = Object.entries(groupedErrors).map(([statusCode, errorGroup]) =>
    ApiResponse({
      status: Number(statusCode),
      type: AppExceptionResponseDto,
      example: errorGroup,
    }),
  )

  return applyDecorators(...decorators)
}
