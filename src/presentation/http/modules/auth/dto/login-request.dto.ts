import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

/**
 * * Data transfers object for Login request
 */
export class LoginRequestDto {
  /**
   * user username
   */
  @ApiProperty({ type: String })
  @IsString()
  username: string

  /**
   * user password
   */
  @ApiProperty({ type: String })
  @IsString()
  password: string
}
