import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

/**
 * * Data transfers object to Id
 */
export class IdDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string
}
