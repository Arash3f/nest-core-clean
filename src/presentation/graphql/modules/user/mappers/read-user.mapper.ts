import type { ReadUsersWithFilterInput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.input"
import type { ReadUsersWithFilterOutput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.output"
import type { PaginationDto } from "@presentation/graphql/common/dto/pagination.dto"
import type { SortByDto } from "@presentation/graphql/common/dto/sort-by.dto"
import type { ReadUserWhereRequestDto } from "@presentation/graphql/modules/user/dto/read-user-request.dto"
import type { ReadUserResponseDto } from "@presentation/graphql/modules/user/dto/read-user-response.dto"
import { UserGraphqlMapper } from "@presentation/graphql/modules/user/mappers/user.mapper"

export class ReadUserGraphqlMapper {
  static toUseCaseInput(
    where?: ReadUserWhereRequestDto,
    pagination?: PaginationDto,
    sortBy?: SortByDto,
  ): ReadUsersWithFilterInput {
    return {
      where,
      pagination: pagination ? { take: pagination.take, skip: pagination.skip } : undefined,
      sortBy: sortBy ? { field: sortBy.field, descending: sortBy.descending } : undefined,
    }
  }

  static toDto(output: ReadUsersWithFilterOutput): ReadUserResponseDto {
    return {
      count: output.count,
      data: output.data.map((user) => UserGraphqlMapper.fromUser(user)),
    }
  }
}
