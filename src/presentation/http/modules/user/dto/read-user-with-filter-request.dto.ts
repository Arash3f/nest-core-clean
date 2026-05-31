import { Role } from "@domain/common/value-objects/role.value-object"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "@presentation/http/common/dto/pagination.dto"
import { SortByDto } from "@presentation/http/common/dto/sort-by.dto"
import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"

/**
 * * Data transfers object to Read User Input
 */
export class ReadUserWhereData {
  /**
   * user id
   */
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  id?: string

  /**
   * user username
   */
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  username?: string

  /**
   * user name
   */
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string

  /**
   * user role
   */
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  /**
   * user activity
   */
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

/**
 * read user input
 */
export class ReadUserRequestDto {
  /**
   * find target user
   */
  @Type(() => ReadUserWhereData)
  @ApiPropertyOptional({ type: ReadUserWhereData })
  @IsOptional()
  @ValidateNested()
  where?: ReadUserWhereData

  /**
   * response pagination
   */
  @Type(() => PaginationDto)
  @ApiPropertyOptional({ type: PaginationDto })
  @IsOptional()
  @ValidateNested()
  pagination?: PaginationDto

  /**
   * response sorting
   */
  @Type(() => SortByDto)
  @ApiPropertyOptional({ type: SortByDto })
  @IsOptional()
  @ValidateNested()
  sortBy?: SortByDto
}
