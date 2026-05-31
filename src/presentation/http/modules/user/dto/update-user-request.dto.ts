import { Role } from "@domain/common/value-objects/role.value-object"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IdDto } from "@presentation/http/common/dto/id.dto"
import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"

/**
 * * Data transfers object to Update User Input
 */
export class UpdateUserRequestData {
  /**
   * user username
   */
  @ApiProperty({ type: String })
  @IsString()
  username: string

  /**
   * user activity
   */
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  active: boolean

  /**
   * user role
   */
  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  /**
   * user name
   */
  @ApiProperty({ type: String })
  @IsString()
  name: string
}

/**
 * update use input
 */
export class UpdateUserRequestDto {
  /**
   * find target user
   */
  @Type(() => IdDto)
  @ApiPropertyOptional({ type: IdDto })
  @ValidateNested()
  where: IdDto

  /**
   * update data
   */
  @Type(() => UpdateUserRequestData)
  @ApiPropertyOptional({ type: UpdateUserRequestData })
  @ValidateNested()
  data: UpdateUserRequestData
}
