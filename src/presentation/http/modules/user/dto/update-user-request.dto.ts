import { Role } from "@domain/common/value-objects/role.value-object"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IdDto } from "@presentation/http/common/dto/id.dto"
import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"

/**
 * Data transfers object to Update User
 */
export class UpdateUserRequestDataDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  active?: boolean

  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string
}

/**
 * update user request DTO
 */
export class UpdateUserRequestDto {
  @Type(() => IdDto)
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  where: IdDto

  @Type(() => UpdateUserRequestDataDto)
  @ApiProperty({ type: UpdateUserRequestDataDto })
  @ValidateNested()
  data: UpdateUserRequestDataDto
}
