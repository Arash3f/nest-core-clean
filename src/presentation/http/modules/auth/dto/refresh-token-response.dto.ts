import { ApiResponseProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

export class RefreshTokenResponseDto {
  @ApiResponseProperty({ type: String })
  @IsJWT()
  accessToken: string

  @ApiResponseProperty({ type: String })
  @IsJWT()
  refreshToken: string
}
