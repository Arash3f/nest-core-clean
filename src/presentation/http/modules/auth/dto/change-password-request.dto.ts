import { ApiProperty } from "@nestjs/swagger"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@presentation/http/common/constants/password"
import { IdDto } from "@presentation/http/common/dto/id.dto"
import { Type } from "class-transformer"
import { IsString, MaxLength, MinLength, ValidateNested } from "class-validator"

export class ChangePasswordRequestDataDto {
  @ApiProperty({ type: String, minLength: PASSWORD_MIN_LENGTH, maxLength: PASSWORD_MAX_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string
}

export class ChangePasswordRequestDto {
  @Type(() => IdDto)
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  where: IdDto

  @Type(() => ChangePasswordRequestDataDto)
  @ApiProperty({ type: ChangePasswordRequestDataDto })
  @ValidateNested()
  data: ChangePasswordRequestDataDto
}
