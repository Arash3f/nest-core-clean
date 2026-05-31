import type { SortByType } from "@domain/common/types/sort-by.type"

export function toPrismaOrderBy(sortBy?: SortByType) {
  const orderBy: Record<string, "asc" | "desc"> = {}
  if (sortBy?.field) orderBy[sortBy.field] = sortBy.descending ? "desc" : "asc"
  return { orderBy }
}
