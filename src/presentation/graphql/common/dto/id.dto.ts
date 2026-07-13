import { Field, InputType } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class IdDto {
  @Field(() => String)
  @IsUUID()
  id: string
}
