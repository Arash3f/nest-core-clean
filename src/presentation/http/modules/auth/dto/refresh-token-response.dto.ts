import { ApiProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

/** @deprecated Prefer LoginResponseDto — kept for OpenAPI compatibility. */
export class RefreshTokenResponseDto {
  @ApiProperty({ type: String })
  @IsJWT()
  accessToken: string

  @ApiProperty({ type: String })
  @IsJWT()
  refreshToken: string
}
