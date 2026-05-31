import { ApiResponseProperty } from "@nestjs/swagger"
import { IsBoolean } from "class-validator"

/**
 * * Data transfer object to Success
 */
export class SuccessDto {
  /**
   * response result
   */
  @ApiResponseProperty({ type: Boolean })
  @IsBoolean()
  success: boolean
}
