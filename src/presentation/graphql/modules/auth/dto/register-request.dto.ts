import { Field, InputType } from "@nestjs/graphql"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/graphql/common/constants/password"
import { IsString, MaxLength, MinLength } from "class-validator"

/**
 * Public self-registration request DTO.
 *
 * Intentionally has no `role` field: registration always creates a `Member`.
 */
@InputType()
export class RegisterRequestDto {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  username: string

  @Field(() => String)
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string
}
