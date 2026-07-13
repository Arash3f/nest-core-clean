import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsOptional, IsString } from "class-validator"

@InputType()
export class SortByDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  field?: string

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  descending = true
}
