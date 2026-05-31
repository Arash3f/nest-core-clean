import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString } from "class-validator"

/**
 * * Data transfer object for Sort By
 */
export class SortByDto {
  /**
   * sort by which field
   */
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  field?: string

  /**
   * descending or ascending
   */
  @ApiPropertyOptional({ type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  descending = true
}
