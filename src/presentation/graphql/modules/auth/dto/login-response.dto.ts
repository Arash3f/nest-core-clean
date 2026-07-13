import { Field, ObjectType } from "@nestjs/graphql"
import { IsJWT } from "class-validator"

@ObjectType()
export class LoginResponseDto {
  @Field(() => String)
  @IsJWT()
  accessToken: string

  @Field(() => String)
  @IsJWT()
  refreshToken: string
}
