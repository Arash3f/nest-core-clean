import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNumber, IsOptional, Max, Min } from "class-validator"

@InputType()
export class PaginationDto {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(0)
  @Max(200)
  @IsNumber()
  take?: number = 10

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  @IsNumber()
  skip?: number = 0
}
