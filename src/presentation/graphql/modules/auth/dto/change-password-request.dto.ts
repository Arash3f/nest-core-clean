import { Field, InputType } from "@nestjs/graphql"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/graphql/common/constants/password"
import { IsString, MaxLength, MinLength } from "class-validator"

@InputType()
export class ChangePasswordRequestDto {
  @Field(() => String)
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string
}
