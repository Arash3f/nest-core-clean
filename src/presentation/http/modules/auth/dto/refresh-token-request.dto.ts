import { ApiProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

export class RefreshTokenRequestDto {
  @ApiProperty({ type: String })
  @IsJWT()
  refreshToken: string
}
