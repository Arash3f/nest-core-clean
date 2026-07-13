import { Role } from "@domain/common/value-objects/role.value-object"
import { Field, InputType } from "@nestjs/graphql"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/graphql/common/constants/password"
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator"

@InputType()
export class CreateUserRequestDto {
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

  @Field(() => Role)
  @IsEnum(Role)
  role: Role
}
