import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, Max, Min } from "class-validator"

/**
 * * Data transfer object for Pagination Input
 */
export class PaginationDto {
  /**
   * how many object take in response
   */
  @ApiPropertyOptional({
    type: Number,
    default: 10,
    minimum: 0,
    maximum: 200,
  })
  @Min(0)
  @Max(200)
  @IsNumber()
  take?: number = 10

  /**
   * skip object
   */
  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  skip?: number = 0

  /**
   * The internal function that prepares the final object for pagination filter, used when working with Prisma
   * @returns pagination object
   * @example
   * In Auth module --> service.ts
   * ```ts
   * const entity = this.prisma.users.findMany({
   * 		where: whereClause,
   * 		...input?.sortBy?.convertToPrismaFilter(),
   * 		...input?.pagination?.convertToPrismaFilter()
   * })
   * ```
   */
  convertToPrismaFilter() {
    return {
      take: this.take,
      skip: this.skip,
    }
  }
}
