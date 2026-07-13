import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, Max, Min } from "class-validator"

/**
 * Data transfer object for Pagination
 */
export class PaginationDto {
  @ApiPropertyOptional({
    type: Number,
    default: 10,
    minimum: 0,
    maximum: 200,
  })
  @IsOptional()
  @Min(0)
  @Max(200)
  @IsNumber()
  take?: number = 10

  @ApiPropertyOptional({
    type: Number,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  @IsNumber()
  skip?: number = 0
}
