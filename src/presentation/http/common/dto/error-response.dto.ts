import { ApiProperty } from "@nestjs/swagger"
import { ModuleNames } from "src/constants"

/**
 * Data transfers object to Exception
 */
export class AppExceptionResponseDto {
  @ApiProperty({
    description: "HTTP status code",
  })
  statusCode: number

  @ApiProperty({
    description: "Error message in English",
  })
  message: string

  @ApiProperty({
    description: "Error message in Persian",
  })
  persianTranslation: string

  @ApiProperty({
    description: "Detailed error message for developers",
    required: false,
  })
  developerMessage?: string

  @ApiProperty({
    description: "Module special error code",
  })
  code: number

  @ApiProperty({
    description: "Module where error occurred",
    enum: ModuleNames,
  })
  module: ModuleNames

  @ApiProperty({
    description: "Timestamp of the error",
    example: "2024-01-01T10:00:00.000Z",
  })
  timestamp: string

  @ApiProperty({
    description: "Request path",
  })
  path: string
}
