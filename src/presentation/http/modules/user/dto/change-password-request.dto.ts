import { ApiProperty } from "@nestjs/swagger"
import { IdDto } from "@presentation/http/common/dto/id.dto"
import { Type } from "class-transformer"
import { IsString, ValidateNested } from "class-validator"

/**
 * * Data transfers object to Change Password Input
 */
export class ChangePasswordRequestData {
  /**
   * user new password
   */
  @ApiProperty({ type: String })
  @IsString()
  newPassword: string
}

/**
 * change password input
 */
export class ChangePasswordRequestDto {
  /**
   * find target user
   */
  @Type(() => IdDto)
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  where: IdDto

  /**
   * update data
   */
  @Type(() => ChangePasswordRequestData)
  @ApiProperty({ type: ChangePasswordRequestData })
  @ValidateNested()
  data: ChangePasswordRequestData
}
