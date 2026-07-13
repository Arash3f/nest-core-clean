import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class SuccessDto {
  @Field(() => Boolean)
  success: boolean
}
