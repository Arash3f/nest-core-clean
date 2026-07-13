import { Role } from "@domain/common/value-objects/role.value-object"
import { ApiProperty } from "@nestjs/swagger"
import { PASSWORD_MIN_LENGTH } from "@presentation/http/common/constants/password"
import { IsEnum, IsString, MinLength } from "class-validator"

/**
 * Data transfers object to Create User
 */
export class CreateUserRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string

  @ApiProperty({ type: String })
  @IsString()
  username: string

  @ApiProperty({ type: String, minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role
}
