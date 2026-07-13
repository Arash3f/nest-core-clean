import { ApiProperty } from "@nestjs/swagger"
import { IsJWT } from "class-validator"

/**
 * Auth token pair returned by login / register / refresh.
 */
export class LoginResponseDto {
  @ApiProperty({ type: String })
  @IsJWT()
  accessToken: string

  @ApiProperty({ type: String })
  @IsJWT()
  refreshToken: string
}
