import { Field, InputType } from "@nestjs/graphql"
import { IsJWT } from "class-validator"

@InputType()
export class RefreshTokenRequestDto {
  @Field(() => String)
  @IsJWT()
  refreshToken: string
}
