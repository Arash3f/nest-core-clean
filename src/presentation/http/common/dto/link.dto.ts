import { ApiResponseProperty } from "@nestjs/swagger"

/**
 * Data transfers object to Link
 */
export class LinkDto {
  @ApiResponseProperty({ type: String })
  url: string
}
