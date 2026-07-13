import { ApiResponseProperty } from "@nestjs/swagger"

/**
 * Data transfer object to Success
 */
export class SuccessDto {
  @ApiResponseProperty({ type: Boolean })
  success: boolean
}
