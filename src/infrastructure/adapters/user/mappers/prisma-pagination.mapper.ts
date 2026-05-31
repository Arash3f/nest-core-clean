import type { PaginationType } from "@domain/common/types/pagination.type"

export function toPrismaPagination(pagination?: PaginationType) {
  return {
    take: pagination?.take ?? 10,
    skip: pagination?.skip ?? 0,
  }
}
