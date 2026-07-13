import { ApiResponseProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

/**
 * Login HTTP response DTO.
 *
 * @remarks
 * Currently mirrors the application login use-case (`jwt` only). When refresh
 * tokens are added, this will expand to `accessToken` + `refreshToken`.
 */
export class LoginResponseDto {
  @ApiResponseProperty({ type: String })
  @IsJWT()
  jwt: string
}
