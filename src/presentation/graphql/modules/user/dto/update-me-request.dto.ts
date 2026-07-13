import { Field, InputType } from "@nestjs/graphql"
import { IsOptional, IsString } from "class-validator"

/**
 * A user updating their own profile request DTO.
 */
@InputType()
export class UpdateMeRequestDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string
}
