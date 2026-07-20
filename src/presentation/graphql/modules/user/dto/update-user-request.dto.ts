import { Role } from "@domain/common/value-objects/role.value-object"
import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateUserRequestDataDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string
}
