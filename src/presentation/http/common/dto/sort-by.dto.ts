import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString } from "class-validator"

/**
 * * Data transfer object for Sort By Input
 */
export class SortByDto {
  /**
   * sort by which field
   */
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  field?: string

  /**
   * descending or ascending
   */
  @ApiPropertyOptional({ type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  descending = true

  /**
   * The internal function that prepares the final object for pagination filter, when working with prisma
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
    const result: { orderBy: Record<string, "asc" | "desc"> } = { orderBy: {} }

    if (this.field) result.orderBy[this.field] = this.descending ? "desc" : "asc"

    return result
  }
}
