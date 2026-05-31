import { ApiResponseProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

/**
 * * Data transfers object for Login response
 */
export class LoginResponseDto {
  /**
   * user jwt
   */
  @ApiResponseProperty({ type: String })
  @IsJWT()
  jwt: string
}
