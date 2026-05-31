import { ApiResponseProperty } from "@nestjs/swagger"
import { UserSimpleModel } from "@presentation/http/modules/user/model/user-simple.model"
import { Type } from "class-transformer"
import { IsArray, IsNumber, ValidateNested } from "class-validator"

/**
 * * Data transfers object to Read User Output
 */
export class ReadUserResponseDto {
  /**
   * users count
   */
  @ApiResponseProperty({ type: Number })
  @IsNumber()
  count: number

  /**
   * users list
   */
  @ApiResponseProperty({ type: [UserSimpleModel] })
  @IsArray()
  @Type(() => UserSimpleModel)
  @ValidateNested()
  data: UserSimpleModel[]
}
