import { ApiResponseProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsBoolean, IsString, IsUUID } from "class-validator"

export class UserSimpleModel {
  /**
   * user id
   */
  @ApiResponseProperty({ type: String })
  @IsUUID()
  id: string

  /**
   * user name
   */
  @ApiResponseProperty({ type: String })
  @IsString()
  name: string

  /**
   * user username
   */
  @ApiResponseProperty({ type: String })
  @IsString()
  username: string

  /**
   * user activity
   */
  @ApiResponseProperty({ type: Boolean })
  @IsBoolean()
  active: boolean

  /**
   * user roel
   */
  @ApiResponseProperty({ enum: Role })
  role: string
}
