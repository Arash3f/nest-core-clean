import { Field, Int, ObjectType } from "@nestjs/graphql"
import { UserModel } from "@presentation/graphql/modules/user/model/user.model"
import { IsNumber } from "class-validator"

@ObjectType()
export class ReadUserResponseDto {
  @Field(() => Int)
  @IsNumber()
  count: number

  @Field(() => [UserModel])
  data: UserModel[]
}
