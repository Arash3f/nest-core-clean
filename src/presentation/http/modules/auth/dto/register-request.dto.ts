import { ApiProperty } from "@nestjs/swagger"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/http/common/constants/password"
import { IsString, MaxLength, MinLength } from "class-validator"

/**
 * Data transfer object for public self-registration.
 *
 * Intentionally has no `role` field: registration always creates a `Member`
 * (the role is forced server-side), so a visitor can't sign themselves up as
 * an Admin. Creating users with an explicit role stays an admin-only operation
 * on `POST /user/createUser`.
 */
export class RegisterRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string

  @ApiProperty({ type: String })
  @IsString()
  username: string

  @ApiProperty({ type: String, minLength: PASSWORD_MIN_LENGTH, maxLength: PASSWORD_MAX_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string
}
