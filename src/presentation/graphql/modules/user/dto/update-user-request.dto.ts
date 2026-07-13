import { Role } from "@domain/common/value-objects/role.value-object"
import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateUserRequestDataDto {
  @Field(() => String)
  @IsString()
  username: string

  @Field(() => Boolean)
  @IsBoolean()
  active: boolean

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @Field(() => String)
  @IsString()
  name: string
}
