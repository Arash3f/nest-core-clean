import { Role } from "@domain/common/value-objects/role.value-object"
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { IsBoolean, IsEnum, IsString, IsUUID } from "class-validator"

registerEnumType(Role, {
  name: "Role",
})

@ObjectType()
export class UserModel {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  username: string

  @Field(() => Boolean)
  @IsBoolean()
  active: boolean

  @Field(() => Role)
  @IsEnum(Role)
  role: Role
}
