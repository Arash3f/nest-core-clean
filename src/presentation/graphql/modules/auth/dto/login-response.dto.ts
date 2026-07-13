import { Field, ObjectType } from "@nestjs/graphql"
import { IsJWT } from "class-validator"

/**
 * Login GraphQL response DTO.
 *
 * @remarks
 * Currently mirrors the application login use-case (`jwt` only). When refresh
 * tokens are added, this will expand to `accessToken` + `refreshToken`.
 */
@ObjectType()
export class LoginResponseDto {
  @Field(() => String)
  @IsJWT()
  jwt: string
}
