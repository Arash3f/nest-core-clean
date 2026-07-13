import { ApiResponseProperty } from "@nestjs/swagger"
import { UserSimpleModel } from "@presentation/http/modules/user/model/user-simple.model"
import { Type } from "class-transformer"
import { IsArray, IsNumber, ValidateNested } from "class-validator"

/**
 * Data transfers object to Read User response
 */
export class ReadUserResponseDto {
  @ApiResponseProperty({ type: Number })
  @IsNumber()
  count: number

  @ApiResponseProperty({ type: [UserSimpleModel] })
  @IsArray()
  @Type(() => UserSimpleModel)
  @ValidateNested()
  data: UserSimpleModel[]
}
