import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { validate as isUUID } from "uuid"

/**
 * Parse UUID Pipe
 *
 * A NestJS pipe that validates and transforms incoming string values to ensure
 * they are valid UUIDs.
 */
@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  /**
   * Validates that the incoming value is a well-formed UUID.
   *
   * @param value - The raw parameter value to validate.
   * @returns The same value, unchanged, when it is a valid UUID.
   * @throws {BadRequestException} When `value` is not a valid UUID.
   */
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new BadRequestException(`Invalid UUID: ${value}`)
    }
    return value
  }
}
