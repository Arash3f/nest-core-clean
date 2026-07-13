import { ApiProperty } from "@nestjs/swagger"
import { PASSWORD_MIN_LENGTH } from "@presentation/http/common/constants/password"
import { IsString, MinLength } from "class-validator"

export class ChangeMyPasswordRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  currentPassword: string

  @ApiProperty({ type: String, minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  newPassword: string
}
