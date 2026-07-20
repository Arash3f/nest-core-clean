import { ApiProperty } from "@nestjs/swagger"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/http/common/constants/password"
import { IsString, MaxLength, MinLength } from "class-validator"

export class ChangeMyPasswordRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  currentPassword: string

  @ApiProperty({ type: String, minLength: PASSWORD_MIN_LENGTH, maxLength: PASSWORD_MAX_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string
}
