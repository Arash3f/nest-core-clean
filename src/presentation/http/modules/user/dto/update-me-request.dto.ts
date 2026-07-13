import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

/**
 * Data transfer object for a user updating their own profile.
 *
 * Deliberately a narrow subset of {@link UpdateUserRequestDataDto}: only `name` and
 * `username` are editable here. `role` and `active` are omitted on purpose so a
 * regular member can't escalate their own privileges or reactivate themselves —
 * those remain admin-only via `POST /user/updateUser`.
 */
export class UpdateMeRequestDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  username?: string
}
