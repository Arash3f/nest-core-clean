import { Role } from "@domain/common/value-objects/role.value-object"
import { Field, ID, InputType } from "@nestjs/graphql"
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"

@InputType()
export class ReadUserWhereRequestDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
