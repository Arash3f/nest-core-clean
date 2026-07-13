import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class LinkDto {
  @Field(() => String)
  url: string
}
