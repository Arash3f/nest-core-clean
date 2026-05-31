import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, Max, Min } from "class-validator"

/**
 * * Data transfer object for Pagination
 */
export class PaginationDto {
  /**
   * how many object take in response
   */
  @ApiPropertyOptional({
    type: Number,
    default: 10,
    minimum: 0,
    maximum: 200,
  })
  @Min(0)
  @Max(200)
  @IsNumber()
  take?: number = 10

  /**
   * skip object
   */
  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  skip?: number = 0
}
