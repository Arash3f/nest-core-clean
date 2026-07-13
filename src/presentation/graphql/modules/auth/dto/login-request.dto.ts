import { Field, InputType } from "@nestjs/graphql"
import { IsString } from "class-validator"

@InputType()
export class LoginRequestDto {
  @Field(() => String)
  @IsString()
  username: string

  @Field(() => String)
  @IsString()
  password: string
}
