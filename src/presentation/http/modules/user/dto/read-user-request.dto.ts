import { Role } from "@domain/common/value-objects/role.value-object"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { ToBoolean, ToNumber } from "@presentation/http/common/transforms"
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator"

/**
 * Query parameters for listing users (`GET /user`).
 */
export class ReadUserRequestDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  id?: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  active?: boolean

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 0, maximum: 200 })
  @IsOptional()
  @ToNumber()
  @Min(0)
  @Max(200)
  @IsNumber()
  take?: number

  @ApiPropertyOptional({ type: Number, default: 0, minimum: 0 })
  @IsOptional()
  @ToNumber()
  @Min(0)
  @IsNumber()
  skip?: number

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  sortField?: string

  @ApiPropertyOptional({ type: Boolean, default: true })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  sortDescending?: boolean
}
